import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { TarotRequestSchema, TarotResponse } from "@tarrot/api-schema";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Vercel AI SDK の Google Provider をインポート
import { generateText, tool } from "ai"; // generateText と tool をインポート
import { z } from "zod";

// タロットAPI
export const tarotApi = new Hono().post(
  "/",
  zValidator("json", TarotRequestSchema),
  async (c) => {
    try {
      const { name, meaning } = c.req.valid("json");
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
          // "Content-Type": "application/json",
          // "x-goog-api-key": process.env.GEMINI_API_KEY!,
          "cf-aig-authorization": `Bearer ${apiToken}`,
        },
      });

      const prompt = `あなたはタロットカード占い師です。タロットカード「${name}」に基づいてキーワード「${meaning}」を含む正位置と逆位置の解釈文を生成し、アドバイスしてください。`;

      // Vercel AI SDK の generateText と tool を使用して構造化されたレスポンスを取得
      const result = await generateText({
        model: google("gemini-2.0-flash-lite"), // 使用するモデルを指定
        prompt: prompt,
        tools: {
          tarotInterpretation: tool({
            description: "タロットカードの正位置と逆位置の解釈を生成する",
            parameters: z.object({
              upright: z.string().describe("タロットカードの正位置の文言"),
              reversed: z.string().describe("タロットカードの逆位置の文言"),
            }),
            // execute: async ({ upright, reversed }) => {
            //   // 必要であればここで何らかの処理を行うことも可能
            //   return { upright, reversed };
            // }
          }),
        },
        toolChoice: "required", // tarotInterpretation ツールを必ず使用させる
      });

      // toolCalls から結果を取得
      const toolCall = result.toolCalls[0];
      if (!toolCall || toolCall.toolName !== "tarotInterpretation") {
        console.error("AI did not return the expected tool call:", result);
        return c.json({ error: "AIからの応答形式が不正です" }, { status: 500 });
      }

      const tarotResponse: TarotResponse = toolCall.args;

      if (!tarotResponse || !tarotResponse.upright || !tarotResponse.reversed) {
        console.error("Invalid response format from tool call:", tarotResponse);
        return c.json({ error: "不正なレスポンス形式です" }, { status: 500 });
      }

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
