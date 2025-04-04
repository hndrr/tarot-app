import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import axios from "axios";
interface TarotResponse {
  upright: string;
  reversed: string;
}

export const generateTarotMessage = async (name: string, meaning: string) => {
  const prompt = `
あなたはタロットカード占い師です。

タロットカード「${name}」に基づいて正位置と逆位置の文言を生成してください。
キーワード: ${meaning}
`;
  const api_token = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
  const account_id = process.env.EXPO_PUBLIC_CLOUDFLARE_ACCOUNT_ID || "";
  const gateway_name = process.env.EXPO_PUBLIC_CLOUDFLARE_GATEWAY_NAME || "";

  const geminiApiEndpoint =
    // "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent";
    `https://gateway.ai.cloudflare.com/v1/${account_id}/${gateway_name}/google-ai-studio/v1/models/gemini-1.5-flash-002:generateContent`;

  const schema = {
    description: "タロットカードの正位置と逆位置の文言を生成する",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        upright: {
          type: SchemaType.STRING,
          description: "タロットカードの正位置の文言",
        },
        reversed: {
          type: SchemaType.STRING,
          description: "タロットカードの逆位置の文言",
        },
      },
      required: ["upright", "reversed"],
    },
  };

  try {
    // const genAI = new GoogleGenerativeAI(api_token);
    // const model = await genAI.getGenerativeModel(
    //   {
    //     model: "gemini-1.5-flash",
    //     generationConfig: {
    //       responseMimeType: "application/json",
    //       responseSchema: schema,
    //     },
    //   },
    //   {
    //     baseUrl: geminiApiEndpoint,
    //   }
    // );
    // const result = await model.generateContent(prompt);
    // console.log(result);
    // const responseText =
    //   result.response.candidates?.[0].content.parts[0].text || "";
    // const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];
    // console.log(tarotResponse);
    // return tarotResponse;

    const response = await axios.post(
      geminiApiEndpoint,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        // generationConfig: {
        //   response_mime_type: "application/json",
        //   response_schema: schema,
        // },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": api_token,
        },
      }
    );

    console.log(response.data);
    const responseText =
      response.data.candidates[0].content.parts[0].text.trim();
    const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];
    console.log(tarotResponse);

    return tarotResponse;
    return "";
  } catch (error) {
    console.error("文言生成エラー:", error);
    if (error instanceof Error) {
      throw new Error(`文言生成に失敗しました: ${error.message}`);
    } else {
      throw new Error("文言生成に失敗しました。予期せぬエラーが発生しました。");
    }
  }
};
