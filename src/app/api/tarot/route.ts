// import { generateTarotMessageGemini } from "@/lib/generateTarotMessageGemini";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

type TarotResponse = {
  upright: string;
  reversed: string;
};

app.post("/api/tarot", async (c) => {
  const { name, meaning } = await c.req.json();
  const prompt = `
  あなたはタロットカード占い師です。

  タロットカード「${name}」に基づいてキーワードを含む正位置と逆位置の解釈文を生成し、アドバイスしてください。
  キーワード: ${meaning}
  `;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;
  const geminiApiEndpoint =
    // "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent";
    `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/google-ai-studio/v1beta/models/gemini-1.5-flash-002:generateContent`;

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

  try {
    // const response = await generateTarotMessageGemini(name, meaning);
    // const tarotResponse = response;
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
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    const responseText = data.candidates[0].content.parts[0].text.trim();
    const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];

    return c.json(tarotResponse);
  } catch (error) {
    console.error("文言生成エラー:", error);
    return c.json({ error: "文言生成に失敗しました。" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
