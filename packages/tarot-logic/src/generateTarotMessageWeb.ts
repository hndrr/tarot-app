import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

// Define the expected response structure using Zod
const TarotResponseSchema = z.object({
  upright: z.string(),
  reversed: z.string(),
});
type TarotResponse = z.infer<typeof TarotResponseSchema>;

// It's generally better to pass configuration like API keys and endpoints
// as arguments or through a configuration object rather than relying on process.env directly
// within a shared library function. This makes the function more testable and reusable.
// However, for now, we'll keep the process.env access as it was in the original file.
const apiKey = process.env.OPENAI_API_KEY;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const gatewayId = process.env.CLOUDFLARE_GATEWAY_NAME;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const baseURL =
  accountId && gatewayId
    ? `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`
    : undefined; // Fallback or handle error if env vars are missing

const client = new OpenAI({
  apiKey,
  baseURL, // baseURL will be undefined if env vars are missing, OpenAI client might handle this or throw error
  defaultHeaders: {
    "cf-aig-authorization": `Bearer ${apiToken}`,
  },
});

export const generateTarotMessageWeb = async (
  name: string,
  meaning: string
): Promise<TarotResponse> => {
  const prompt = `
あなたはタロットカード占い師です。

タロットカード「${name}」に基づいてキーワードを含む正位置と逆位置の解釈文を生成し、アドバイスしてください。
キーワード: ${meaning}
`;

  // API呼び出し
  try {
    // Ensure the client was initialized correctly (apiKey is present)
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }

    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "system", content: prompt }],
      response_format: zodResponseFormat(TarotResponseSchema, "tarot_response"),
      max_tokens: 300,
      temperature: 1,
    });

    console.log("Raw completion (Web):", completion);

    // The 'parsed' property is added by zodResponseFormat
    const parsedResponse = completion.choices[0]?.message?.parsed;

    if (!parsedResponse) {
      throw new Error("Failed to parse response from OpenAI API");
    }

    console.log("文言生成成功 (Web):", parsedResponse);

    return parsedResponse; // Return the parsed Zod object
  } catch (error) {
    console.error(
      "文言生成エラー (Web):",
      error instanceof Error ? error.message : error
    );
    // Consider more specific error handling based on OpenAI client errors
    throw new Error("文言生成に失敗しました。");
  }
};
