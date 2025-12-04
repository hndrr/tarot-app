import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { processTtsRequest, Env } from "@/app/api/tts/api";
import { providers } from "@/constants/ttsConstants";

const schema = z.object({
  prompt: z.string().min(1, "占いの内容は必須です"),
  enableAudio: z.boolean().optional().default(true),
});

// Hono アプリケーションを作成
export const narrationApi = new Hono().post(
  "/",
  zValidator("json", schema), // リクエストボディのバリデーション
  async (c) => {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    // const google = createGoogleGenerativeAI({
    //   apiKey: process.env.GEMINI_API_KEY,
    // });

    const { prompt, enableAudio } = c.req.valid("json");

    try {
      // @ai-sdk/openai を使用してナレーションテキストを生成
      const { text: narrationText } = await generateText({
        model: openai("gpt-4.1-nano"),
        // model: google("gemini-2.0-flash-lite"),
        system:
          "神秘的なタロット占い師です。口調は優しく、文言は適切に改行してください。",
        prompt: prompt,
      });

      if (!narrationText) {
        console.error("OpenAI Chat Completion API Error: No text generated");
        return c.json({ error: "ナレーションの生成に失敗しました。" }, 500);
      }

      // Gemini の音声プロバイダーを取得
      // const voices = providers.find((p) => p.id === "gemini")?.voices || [];
      const voices = providers.find((p) => p.id === "openai")?.voices || [];

      let audioBase64 = "";
      let contentType = "";

      if (enableAudio) {
        // TTS API を直接呼び出す
        const ttsResult = await processTtsRequest(
          {
            text: narrationText,
            provider: "openai",
            voice:
              voices[Math.floor(Math.random() * voices.length)].id || "nova",
            model_id: "gpt-4o-mini-tts",
            instruction:
              "あなたはタロット占い師です。女性的で神秘的な雰囲気を持っています。",
          },
          // {
          //   text: narrationText,
          //   provider: "gemini",
          //   voice:
          //     voices[Math.floor(Math.random() * voices.length)].id || "Sulafat",
          //   instruction:
          //     "あなたはタロット占い師です。口調は優しく、神秘的な雰囲気を持っています。",
          // },
          c.env as Env["Bindings"] // Hono のコンテキストから環境変数を渡す
        );

        if ("error" in ttsResult) {
          console.error("TTS API Error:", ttsResult.error);
          // TTS失敗時もtextだけは必ず返し、audioBase64は空文字で返す
          // ここでreturnせず、audioBase64とcontentTypeを空のまま進める
        } else {
          // ReadableStream を Buffer に変換
          const audioBuffer = ttsResult.audioBuffer;
          audioBase64 = Buffer.from(audioBuffer).toString("base64");
          contentType = ttsResult.contentType;
        }
      }

      // 成功レスポンスを返す
      return c.json({
        text: narrationText,
        audioBase64,
        contentType,
      });
    } catch (error) {
      console.error("Narration API Error:", error);
      // エラーの詳細をログに出力
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      // 予期しないエラー時もtextだけは必ず返し、audioBase64は空文字で返す
      return c.json({
        text: typeof prompt === "string" ? prompt : "",
        audioBase64: "",
        contentType: "",
      });
    }
  }
);
