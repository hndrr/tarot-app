import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { speak } from "orate";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OpenAI } from "orate/openai";

const schema = z.object({
  prompt: z.string().min(1, "占いの内容は必須です"), // theme を prompt に変更し、メッセージも更新
});

// Hono アプリケーションを作成
export const narrationApi = new Hono().post(
  "/",
  zValidator("json", schema), // リクエストボディのバリデーション
  async (c) => {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openaiTTS = new OpenAI(process.env.OPENAI_API_KEY);

    const { prompt } = c.req.valid("json"); // theme を prompt に変更

    try {
      // @ai-sdk/openai を使用してナレーションテキストを生成
      const { text: narrationText } = await generateText({
        model: openai("gpt-4o-mini"),
        system:
          "あなたは神秘的なタロット占い師です。口調は優しく、文言は適切に改行してください。「もちろんです。」から会話を始めないでください",
        prompt: prompt, // 受け取った prompt をそのまま使用
      });

      if (!narrationText) {
        console.error("OpenAI Chat Completion API Error: No text generated");
        return c.json({ error: "ナレーションの生成に失敗しました。" }, 500);
      }

      // openai SDK を使用して TTS を実行
      // Orate がサポートする OpenAI の女性の声
      const femaleVoices = ["nova", "shimmer", "sage"] as const;
      // ランダムに声を選択
      const randomVoice =
        femaleVoices[Math.floor(Math.random() * femaleVoices.length)];

      // orate の speak 関数を使用して TTS を実行
      const ttsResponse = await speak({
        model: openaiTTS.tts("tts-1", randomVoice),
        prompt: narrationText,
      });

      // ReadableStream を Buffer に変換
      // speak 関数のレスポンスから音声データを取得
      const audioBuffer = await ttsResponse.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");

      // 成功レスポンスを返す
      return c.json({
        text: narrationText,
        audioBase64,
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
