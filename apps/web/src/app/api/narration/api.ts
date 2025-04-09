import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai"; // @ai-sdk/openai をインポート
import { generateText } from "ai"; // ai パッケージから generateText をインポート
import OpenAI from "openai"; // openai パッケージをインポート

// OpenAI クライアントを初期化 (@ai-sdk/openai)
// 環境変数 OPENAI_API_KEY は自動的に読み込まれます
const openai = createOpenAI();

// OpenAI クライアントを初期化 (openai SDK for TTS)
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// バリデーションスキーマを定義
const schema = z.object({
  prompt: z.string().min(1, "占いの内容は必須です"), // theme を prompt に変更し、メッセージも更新
});

// Hono アプリケーションを作成
export const narrationApi = new Hono().post(
  "/",
  zValidator("json", schema), // リクエストボディのバリデーション
  async (c) => {
    const { prompt } = c.req.valid("json"); // theme を prompt に変更

    try {
      // @ai-sdk/openai を使用してナレーションテキストを生成
      const { text: narrationText } = await generateText({
        model: openai("gpt-4o"),
        system:
          "あなたは神秘的なタロット占い師です。口調は優しく、文言は適切に改行してください。「もちろんです。」から会話を始めないでください",
        prompt: prompt, // 受け取った prompt をそのまま使用
      });

      if (!narrationText) {
        console.error("OpenAI Chat Completion API Error: No text generated");
        return c.json({ error: "ナレーションの生成に失敗しました。" }, 500);
      }

      // openai SDK を使用して TTS を実行
      // 女性の声のリスト
      const femaleVoices = ["sage", "nova", "shimmer"] as const;
      // ランダムに声を選択
      const randomVoice =
        femaleVoices[Math.floor(Math.random() * femaleVoices.length)];

      const ttsResponse = await openaiClient.audio.speech.create({
        model: "tts-1",
        voice: randomVoice, // ランダムに選択された声を使用
        input: narrationText,
      });

      // ReadableStream を Buffer に変換
      const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
      const audioBase64 = audioBuffer.toString("base64");

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
