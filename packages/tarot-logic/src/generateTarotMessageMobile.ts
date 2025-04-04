import axios from "axios";

// Define the expected response structure
type TarotResponse = {
  upright: string;
  reversed: string;
};

export const generateTarotMessageMobile = async (
  name: string,
  meaning: string
): Promise<TarotResponse> => {
  const prompt = `
タロットカード「${name}」に基づいて正位置と逆位置の文言を生成してください。
キーワード: ${meaning}
`;

  // JSON Schemaの定義 (Matches TarotResponse type)
  const jsonSchema = {
    type: "object",
    properties: {
      upright: { type: "string" },
      reversed: { type: "string" },
    },
    required: ["upright", "reversed"],
    additionalProperties: false,
  };

  // API呼び出し
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "あなたはタロットカード占い師です。" },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "tarot_response",
            strict: true,
            schema: jsonSchema,
          },
        },
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          // Ensure this environment variable is accessible in the context where this function runs
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Assuming the response structure matches the API documentation
    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Invalid response structure from OpenAI API");
    }

    const parsedResponse: TarotResponse = JSON.parse(content);

    console.log("文言生成成功 (Mobile):", parsedResponse);

    return parsedResponse; // JSON形式で返す
  } catch (error) {
    console.error(
      "文言生成エラー (Mobile):",
      error instanceof Error ? error.message : error
    );
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    }
    throw new Error("文言生成に失敗しました。");
  }
};
