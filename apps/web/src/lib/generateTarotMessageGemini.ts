import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

export const generateTarotMessageGemini = async (
  name: string,
  meaning: string
) => {
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

  // API呼び出し
  try {
    const completion = await client.beta.chat.completions.parse({
      model: "gemini-1.5-flash-002",
      messages: [{ role: "system", content: prompt }],
      response_format: zodResponseFormat(jsonSchema, "tarot_response"),
      // max_tokens: 300,
      // temperature: 1,
    });

    console.log(completion);

    const parsedResponse = completion.choices[0].message.parsed;

    console.log("文言生成成功:", parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error("文言生成エラー:", error);
    throw new Error("文言生成に失敗しました。");
  }
};
