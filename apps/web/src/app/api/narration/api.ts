import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

// バリデーションスキーマを定義
const schema = z.object({
  theme: z.string().min(1, "テーマは必須です"),
});

// Hono アプリケーションを作成
const narrationApi = new Hono();

// POST /api/narration ルートを定義
narrationApi.post(
  "/",
  zValidator("json", schema), // リクエストボディのバリデーション
  async (c) => {
    const { theme } = c.req.valid("json");

    try {
      // OpenAI API へのリクエスト (Chat Completion)
      const prompt = [
        {
          role: "system",
          content: "あなたは神秘的な占い師です。口調は優しく古風です。",
        },
        {
          role: "user",
          content: `${theme}に関する占いの前口上を200文字以内で書いてください。`,
        },
      ];

      const completionRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: prompt,
          }),
        }
      );

      if (!completionRes.ok) {
        console.error(
          "OpenAI Chat Completion API Error:",
          await completionRes.text()
        );
        return c.json({ error: "ナレーションの生成に失敗しました。" }, 500);
      }

      const completionData = await completionRes.json();
      const narrationText = completionData.choices[0].message.content;

      // OpenAI API へのリクエスト (TTS)
      const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: "shimmer",
          input: narrationText,
        }),
      });

      if (!ttsRes.ok) {
        console.error("OpenAI TTS API Error:", await ttsRes.text());
        return c.json({ error: "音声の生成に失敗しました。" }, 500);
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");

      // 成功レスポンスを返す
      return c.json({
        text: narrationText,
        audioBase64,
      });
    } catch (error) {
      console.error("Narration API Error:", error);
      return c.json({ error: "サーバー内部エラーが発生しました。" }, 500);
    }
  }
);

export { narrationApi }; // narrationApi をエクスポート
