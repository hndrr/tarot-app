import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { TarotRequestSchema, TarotResponse } from "@tarrot/api-schema";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Vercel AI SDK の Google Provider をインポート
import { generateText, tool } from "ai"; // generateText と tool をインポート
import { z } from "zod"; // zod を再度インポート

// Zod スキーマを定義 (tool と検証で再利用)
const tarotInterpretationSchema = z.object({
  upright: z
    .string()
    .describe("タロットカードの正位置の詳細な解釈文とアドバイス"),
  reversed: z
    .string()
    .describe("タロットカードの逆位置の詳細な解釈文とアドバイス"),
});

// タロットAPI
export const tarotApi = new Hono().post(
  "/",
  zValidator("json", TarotRequestSchema),
  async (c) => {
    try {
      const { name, meaning } = await c.req.valid("json");
      console.log("Received request:", { name, meaning });

      // Cloudflare AI Gateway の設定
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;
      const apiToken = process.env.CLOUDFLARE_API_TOKEN; // Cloudflare API Token (AI Gateway用)
      const googleApiKey = process.env.GEMINI_API_KEY;

      if (!accountId || !gatewayId || !apiToken || !googleApiKey) {
        console.error("Missing Cloudflare AI Gateway credentials");
        return c.json(
          { error: "サーバーの設定が不適切です (CF)" },
          { status: 500 }
        );
      }

      // Cloudflare AI Gateway のエンドポイント
      // 注意: モデルパスは createGoogleGenerativeAI や model 指定で解決されるため、baseURL には含めない
      const cloudflareBaseUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/google-ai-studio/v1beta`;

      // Vercel AI SDK を使用して Google Generative AI プロバイダーを作成し、Cloudflare Gateway を経由させる
      const google = createGoogleGenerativeAI({
        apiKey: googleApiKey,
        baseURL: cloudflareBaseUrl,
        headers: {
          "cf-aig-authorization": `Bearer ${apiToken}`,
        },
      });

      // プロンプトを修正し、tool の各フィールドに対する詳細な指示を追加
      const prompt = `あなたはプロのタロットカード占い師です。
以下のタロットカード「${name}」について、指定されたキーワード「${meaning}」を踏まえ、tarotInterpretation ツールの **upright** フィールドと **reversed** フィールドに、それぞれ対応する解釈とアドバイスを生成してください。

*   **指示:**
    *   **upright** フィールドには、正位置の解釈を記述してください。キーワード「${meaning}」を自然に文章に組み込み、具体的な状況や感情に触れながら、読者が深く理解できるような解説文と、それに基づいた具体的なアドバイスを自然な文章で含めてください。単なるキーワードの羅列は避け、適切に改行をいれてください。
    *   **reversed** フィールドには、逆位置の解釈を記述してください。同様に、キーワード「${meaning}」を自然に文章に組み込み、具体的な状況や感情に触れながら、読者が深く理解できるような解説文と、それに基づいた具体的なアドバイスを自然な文章で含めてください。単なるキーワードの羅列は避け、適切に改行をいれてください。

必ず tarotInterpretation ツールを呼び出して、上記の指示に従った内容を各フィールドに設定してください。`;

      // Vercel AI SDK の generateText と tool を使用して構造化されたレスポンスを取得
      const result = await generateText({
        model: google("gemini-2.0-flash-lite"), // 使用するモデルを指定
        prompt: prompt,
        temperature: 0.7, // Temperature を少し上げて創造性を許容
        tools: {
          // tools を再度追加
          tarotInterpretation: tool({
            description:
              "タロットカードの正位置と逆位置の詳細な解釈文とアドバイスを生成する", // description を更新
            parameters: tarotInterpretationSchema, // 定義済みのスキーマを使用
          }),
        },
        toolChoice: "required", // tool を必須にする
      });

      // console.log("Raw AI Result:", JSON.stringify(result, null, 2)); // 必要ならコメント解除

      // toolCalls から結果を取得するように戻す
      const toolCall = result.toolCalls?.[0]; // Optional chaining を追加
      if (!toolCall || toolCall.toolName !== "tarotInterpretation") {
        console.error("AI did not return the expected tool call:", result);
        // フォールバックとしてテキストを返す試み (必要に応じて)
        if (result.text) {
          console.warn("Tool call failed, returning raw text as fallback.");
          return c.json({ upright: result.text, reversed: "" }); // 仮のフォールバック
        }
        return c.json({ error: "AIからの応答形式が不正です" }, { status: 500 });
      }

      // toolCall.args を zod スキーマで安全にパース（検証）
      const parseResult = tarotInterpretationSchema.safeParse(toolCall.args);

      if (!parseResult.success) {
        console.error(
          "Failed to parse tool call arguments:",
          parseResult.error.errors // zod のエラー詳細を出力
        );
        console.error("Raw arguments:", toolCall.args); // 生の引数もログに出力
        return c.json(
          { error: "AIからの応答形式がスキーマと一致しません" },
          { status: 500 }
        );
      }

      // 検証済みのデータを TarotResponse として使用
      const tarotResponse: TarotResponse = parseResult.data;

      console.log(
        "Successfully generated tarot interpretation:",
        tarotResponse
      );
      return c.json(tarotResponse);
    } catch (error) {
      console.error("Error generating tarot interpretation:", error);
      // エラーオブジェクトが Error インスタンスかチェック
      if (error instanceof Error) {
        // Vercel AI SDK のエラーレスポンスなどを考慮
        console.error("Error details:", error.message);
        // 具体的なエラーメッセージに基づいてクライアントへのレスポンスを調整することも可能
        if (error.message.includes("API key")) {
          return c.json(
            { error: "AIサービスの認証に失敗しました" },
            { status: 500 }
          );
        }
      }
      return c.json(
        { error: "文言生成中に予期せぬエラーが発生しました" },
        { status: 500 }
      );
    }
  }
);
