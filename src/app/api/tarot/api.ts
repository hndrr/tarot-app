import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { TarotRequestSchema, TarotResponse } from "../api-schema";

// タロットAPI
export const tarotApi = new Hono().post(
  "/",
  zValidator("json", TarotRequestSchema),
  async (c) => {
    try {
      const { name, meaning } = await c.req.valid("json");
      console.log("Received request:", { name, meaning });

      const prompt = `
      あなたはタロットカード占い師です。

      タロットカード「${name}」に基づいてキーワードを含む正位置と逆位置の解釈文を生成し、アドバイスしてください。
      キーワード: ${meaning}
      `;

      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;

      if (!accountId || !gatewayId) {
        console.error("Missing Cloudflare credentials");
        return c.json({ error: "サーバーの設定が不適切です" }, { status: 500 });
      }

      const geminiApiEndpoint = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/google-ai-studio/v1beta/models/gemini-1.5-flash-002:generateContent`;

      console.log("Calling Gemini API");

      const schema = {
        description: "タロットカードの正位置と逆位置の文言を生成する",
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            upright: {
              type: "string",
              description: "タロットカードの正位置の文言",
            },
            reversed: {
              type: "string",
              description: "タロットカードの逆位置の文言",
            },
          },
          required: ["upright", "reversed"],
        },
      };

      const response = await fetch(geminiApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            response_schema: schema,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        return c.json(
          { error: "AI APIでエラーが発生しました" },
          { status: 500 }
        );
      }

      const data = await response.json();
      console.log("Gemini API Response:", data);

      const responseText = data.candidates[0].content.parts[0].text.trim();
      const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];

      if (!tarotResponse || !tarotResponse.upright || !tarotResponse.reversed) {
        console.error("Invalid response format:", tarotResponse);
        return c.json({ error: "不正なレスポンス形式です" }, { status: 500 });
      }

      return c.json(tarotResponse);
    } catch (error) {
      console.error("文言生成エラー:", error);
      return c.json({ error: "文言生成に失敗しました" }, { status: 500 });
    }
  }
);
