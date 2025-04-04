import axios from "axios";

export const generateTarotMessage = async (name: string, meaning: string) => {
  const prompt = `
タロットカード「${name}」に基づいて正位置と逆位置の文言を生成してください。
キーワード: ${meaning}
`;

  // JSON Schemaの定義
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
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const parsedResponse = JSON.parse(response.data.choices[0].message.content);

    console.log("文言生成成功:", parsedResponse);

    return parsedResponse; // JSON形式で返す
  } catch (error) {
    console.error("文言生成エラー:", error);
    throw new Error("文言生成に失敗しました。");
  }
};
