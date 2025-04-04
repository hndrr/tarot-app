import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const apiKey = process.env.OPENAI_API_KEY;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;
const baseURL = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`;

const client = new OpenAI({ apiKey, baseURL });

export const generateTarotMessage = async (name: string, meaning: string) => {
  const prompt = `
あなたはタロットカード占い師です。

タロットカード「${name}」に基づいてキーワードを含む正位置と逆位置の解釈文を生成し、アドバイスしてください。
キーワード: ${meaning}
`;

  // JSON Schemaの定義
  const jsonSchema = z.object({
    upright: z.string(),
    reversed: z.string(),
  });

  // {
  //   type: "object",
  //   properties: {
  //     upright: { type: "string" },
  //     reversed: { type: "string" },
  //   },
  //   required: ["upright", "reversed"],
  //   additionalProperties: false,
  // };

  // API呼び出し
  try {
    // const response = await fetch(
    //   "https://api.openai.com/v1/chat/completions",
    //   {
    //     model: "gpt-4o-mini-2024-07-18",
    //     messages: [{ role: "system", content: prompt }],
    //     response_format: {
    //       type: "json_schema",
    //       json_schema: {
    //         name: "tarot_response",
    //         strict: true,
    //         schema: jsonSchema,
    //       },
    //     },
    //     max_tokens: 300,
    //     temperature: 0.7,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "system", content: prompt }],
      response_format: zodResponseFormat(jsonSchema, "tarot_response"),
      max_tokens: 300,
      temperature: 1,
    });

    console.log(completion);

    const parsedResponse = completion.choices[0].message.parsed;

    console.log("文言生成成功:", parsedResponse);

    return parsedResponse; // JSON形式で返す
  } catch (error) {
    console.error("文言生成エラー:", error);
    throw new Error("文言生成に失敗しました。");
  }
};
