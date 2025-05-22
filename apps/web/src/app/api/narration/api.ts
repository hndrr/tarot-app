import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
// import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { processTtsRequest, Env } from "@/app/api/tts/api";
import { providers } from "@/constants/ttsConstants";

const schema = z.object({
  prompt: z.string().min(1, "占いの内容は必須です"), // theme を prompt に変更し、メッセージも更新
});

// Hono アプリケーションを作成
export const narrationApi = new Hono().post(
  "/",
  zValidator("json", schema), // リクエストボディのバリデーション
  async (c) => {
    // const openai = createOpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const { prompt } = c.req.valid("json"); // theme を prompt に変更

    try {
      // @ai-sdk/openai を使用してナレーションテキストを生成
      const { text: narrationText } = await generateText({
        // model: openai("gpt-4.1-nano"),
        model: google("gemini-2.0-flash-lite"),
        system:
          "あなたは神秘的なタロット占い師です。口調は優しく、文言は適切に改行してください。",
        prompt: prompt,
      });

      if (!narrationText) {
        console.error("OpenAI Chat Completion API Error: No text generated");
        return c.json({ error: "ナレーションの生成に失敗しました。" }, 500);
      }

      // Gemini の音声プロバイダーを取得
      const voices = providers.find((p) => p.id === "gemini")?.voices || [];

      // TTS API を直接呼び出す
      const ttsResult = await processTtsRequest(
        // {
        //   text: narrationText,
        //   provider: "openai",
        //   voice: "alloy",
        // },
        {
          text: narrationText,
          provider: "gemini",
          voice:
            voices[Math.floor(Math.random() * voices.length)].id || "Sulafat",
          instruction:
            "あなたは神秘的なタロット占い師です。口調は優しく、文言は適切に改行してください。",
        },
        c.env as Env["Bindings"] // Hono のコンテキストから環境変数を渡す
      );

      if ("error" in ttsResult) {
        console.error("TTS API Error:", ttsResult.error);
        return c.json({ error: ttsResult.error }, 500);
      }

      // ReadableStream を Buffer に変換
      const audioBuffer = ttsResult.audioBuffer;
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");

      // 成功レスポンスを返す
      return c.json({
        text: narrationText,
        audioBase64,
        contentType: ttsResult.contentType,
      });
    } catch (error) {
      console.error("Narration API Error:", error);
      // エラーの詳細をログに出力
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return c.json({ error: "サーバー内部エラーが発生しました。" }, 500);
    }
  }
);
