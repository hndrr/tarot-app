import axios from "axios";
import { TarotResponse } from "@tarrot/api-schema";
import Constants from "expo-constants";

// 環境に応じたAPIのURLを取得 (フェーズ1では開発用URLを優先)
const getApiUrl = () => {
  // app.jsonのextraから取得を試みる
  const extra = Constants.expoConfig?.extra;
  if (extra?.webApiUrl?.development) {
    return extra.webApiUrl.development;
  }
  // 環境変数から取得 (フォールバック)
  return process.env.EXPO_PUBLIC_WEB_API_URL || "http://localhost:3000/api";
};

/**
 * Web API (/api/tarot) を呼び出してタロットメッセージを生成します。
 * (フェーズ1: 基本的な実装)
 */
export const generateTarotMessageFromWebApi = async (
  name: string,
  meaning: string
): Promise<TarotResponse> => {
  try {
    const apiUrl = getApiUrl();
    console.log(
      `[generateTarotMessageFromWebApi] Calling API: ${apiUrl}/tarot`
    );

    const response = await axios.post<TarotResponse>(`${apiUrl}/tarot`, {
      name,
      meaning,
    });

    // レスポンス形式の基本的な検証
    if (
      !response.data ||
      typeof response.data.upright !== "string" ||
      typeof response.data.reversed !== "string"
    ) {
      console.error(
        "[generateTarotMessageFromWebApi] Invalid response format:",
        response.data
      );
      throw new Error("Invalid response format from Web API");
    }

    console.log("[generateTarotMessageFromWebApi] Success:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "[generateTarotMessageFromWebApi] Error calling Web API:",
      error
    );
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error details:",
        error.response?.status,
        error.response?.data
      );
    }
    // フェーズ1ではエラーをそのままスローする
    throw new Error("Failed to generate tarot message from Web API");
  }
};
