import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { TarotRequestSchema, TarotResponseSchema } from "@tarrot/api-schema";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Vercel AI SDK の Google Provider をインポート
import { generateText, tool } from "ai"; // generateText と tool をインポート
import { z } from "zod"; // zod を再度インポート
import { speak } from "orate"; // orate をインポート
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OpenAI as OpenAITTSClient } from "orate/openai"; // orate/openai をインポート (名前の衝突を避けるため別名で)

// レスポンススキーマに audioBase64 を追加 (一時的な対応、後で @tarrot/api-schema を更新)
// ※ 本来は @tarrot/api-schema で定義すべきですが、一旦ここで拡張します
const TarotResponseWithAudioSchema = TarotResponseSchema.extend({
  audioBase64: z.string().optional(), // 音声データを Base64 文字列で返す (optional にしておく)
});
type TarotResponseWithAudio = z.infer<typeof TarotResponseWithAudioSchema>;

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
      const { name, meaning } = c.req.valid("json");
      console.log("Received request:", { name, meaning });

      // Cloudflare AI Gateway の設定
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;
      const apiToken = process.env.CLOUDFLARE_API_TOKEN; // Cloudflare API Token (AI Gateway用)
      const googleApiKey = process.env.GEMINI_API_KEY;
      const openaiApiKey = process.env.OPENAI_API_KEY; // OpenAI API キーを追加

      if (
        !accountId ||
        !gatewayId ||
        !apiToken ||
        !googleApiKey ||
        !openaiApiKey
      ) {
        // openaiApiKey のチェックを追加
        console.error("Missing Cloudflare AI Gateway or OpenAI credentials");
        return c.json(
          { error: "サーバーの設定が不適切です (CF or OpenAI)" }, // エラーメッセージを更新
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
      // --- Gemini API 設定 ここまで ---

      // --- OpenAI TTS クライアント初期化 ---
      const openaiTTS = new OpenAITTSClient(openaiApiKey);
      // --- OpenAI TTS クライアント初期化 ここまで ---

      // --- Gemini でテキスト生成 (変更なし) ---

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

      const tarotTextData = parseResult.data; // パース結果を保持
      // --- Gemini でテキスト生成 ここまで ---

      // --- TTS 処理 ---
      let audioBase64: string | undefined = undefined;
      try {
        // 正位置と逆位置のテキストを結合して TTS のプロンプトを作成
        const textToSpeak = `${tarotTextData.upright}\n\n${tarotTextData.reversed}`;

        // orate がサポートする OpenAI の女性の声
        const femaleVoices = ["nova", "shimmer", "sage"] as const;
        // ランダムに声を選択
        const randomVoice =
          femaleVoices[Math.floor(Math.random() * femaleVoices.length)];

        // orate の speak 関数を使用して TTS を実行
        const ttsResponse = await speak({
          model: openaiTTS.tts("tts-1", randomVoice),
          prompt: textToSpeak,
        });

        // ReadableStream を Buffer に変換し、Base64 エンコード
        const audioBuffer = await ttsResponse.arrayBuffer();
        audioBase64 = Buffer.from(audioBuffer).toString("base64");
        console.log("Successfully generated TTS audio.");
      } catch (ttsError) {
        console.error("TTS Error:", ttsError);
        // TTS エラーが発生しても、テキストデータは返すようにする (audioBase64 は undefined のまま)
        if (ttsError instanceof Error) {
          console.error("TTS Error message:", ttsError.message);
          console.error("TTS Error stack:", ttsError.stack);
        }
      }
      // --- TTS 処理 ここまで ---

      // --- レスポンス作成 ---
      // 検証済みのテキストデータと音声データを含むレスポンスを作成
      const finalResponse: TarotResponseWithAudio = {
        ...tarotTextData, // upright, reversed を展開
        audioBase64, // audioBase64 を追加
      };

      console.log(
        "Successfully generated tarot interpretation and TTS:",
        {
          upright: finalResponse.upright,
          reversed: finalResponse.reversed,
          hasAudio: !!finalResponse.audioBase64,
        } // ログ出力を調整
      );
      return c.json(finalResponse);
      // --- レスポンス作成 ここまで ---
    } catch (error) {
      console.error("Error in tarot API:", error); // エラーログのスコープを広げる
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        if (error.message.includes("API key")) {
          return c.json(
            { error: "AIサービスの認証に失敗しました" },
            { status: 500 }
          );
        }
      }
      return c.json(
        { error: "API処理中に予期せぬエラーが発生しました" }, // エラーメッセージを更新
        { status: 500 }
      );
    }
  }
);
