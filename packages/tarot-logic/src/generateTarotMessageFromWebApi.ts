import axios, { AxiosError } from "axios";
import { TarotResponse } from "@tarrot/api-schema"; // 正しいパッケージ名を使用
import Constants from "expo-constants";
// import { generateTarotMessageMobile } from "./generateTarotMessageMobile"; // フォールバック削除

// 環境に応じたAPIのURLを取得
const getApiUrl = () => {
  const env = process.env.NODE_ENV || "development";
  const extra = Constants.expoConfig?.extra;

  if (extra?.webApiUrl) {
    const url =
      extra.webApiUrl[env] ||
      extra.webApiUrl.development ||
      process.env.EXPO_PUBLIC_WEB_API_URL ||
      "http://localhost:3000/api";
    console.log("[getApiUrl] Using URL:", url);
    return url;
  }

  const url =
    process.env.EXPO_PUBLIC_WEB_API_URL || "http://localhost:3000/api";
  return url;
};

// APIキーを取得 (環境変数からのみ)
const getApiKey = () => {
  // const extra = Constants.expoConfig?.extra; // app.jsonからは取得しない
  // console.log("[getApiKey] Constants.expoConfig.extra:", extra);
  const apiKey = process.env.EXPO_PUBLIC_API_KEY || "";
  if (!apiKey) {
    // キーが見つからない場合の警告（開発中のみ）
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[getApiKey] EXPO_PUBLIC_API_KEY environment variable is not set. API calls might fail."
      );
    }
  }
  console.log(
    "[getApiKey] API key from env var:",
    apiKey ? "******" : "(empty)"
  ); // キー自体はログに出さない
  // 閉じ括弧と重複ログを削除
  return apiKey;
};

/**
 * Web API (/api/tarot) を呼び出してタロットメッセージを生成します。
 * エラーハンドリングを含みます（フォールバックは削除）。
 */
export const generateTarotMessageFromWebApi = async (
  name: string,
  meaning: string
): Promise<TarotResponse> => {
  try {
    const apiUrl = getApiUrl();
    const apiKey = getApiKey();
    console.log(
      `[generateTarotMessageFromWebApi] Calling API: ${apiUrl}/tarot`
    );
    // APIキーのチェック（開発環境でも警告を出す）
    if (!apiKey) {
      console.warn(
        "[generateTarotMessageFromWebApi] API Key is missing. This will likely cause authentication failure."
      );
      if (process.env.NODE_ENV !== "development") {
        // 本番でキーがない場合はエラーにする
        throw new Error("API Key is required for production environment.");
      }
    }

    const response = await axios.post<TarotResponse>(
      `${apiUrl}/tarot`,
      {
        name,
        meaning,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        timeout: 15000, // タイムアウトを15秒に設定
      }
    );

    // レスポンス形式の検証
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
      error instanceof Error ? error.message : error
    );

    // Axiosエラーの詳細ログ
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error details:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        code: axiosError.code,
      });
    }

    // エラーをスローして呼び出し元で処理させる
    throw new Error(
      `Failed to generate tarot message from Web API: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
