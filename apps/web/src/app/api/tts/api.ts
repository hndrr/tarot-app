import { Hono } from "hono";
import { cors } from "hono/cors";
import { GoogleGenAI } from "@google/genai";
import { experimental_generateSpeech as generateSpeech } from "ai";
import { openai } from "@ai-sdk/openai";
// import { elevenlabs } from "@ai-sdk/elevenlabs";
// import { google } from "@ai-sdk/google";
import type {
  Experimental_SpeechResult as SpeechResult,
  GeneratedAudioFile,
} from "ai";

export type Env = {
  // Env をエクスポート
  Bindings: {
    OPENAI_API_KEY?: string;
    ELEVENLABS_API_KEY?: string;
    GOOGLE_TTS_API_KEY?: string;
    VOICEVOX_HOST?: string;
    AIVIS_HOST?: string;
    GEMINI_API_KEY?: string;
  };
};

// Hono バックエンドとフロントエンドで共有される TTS 関連の型定義

/**
 * サポートされている TTS プロバイダーの ID
 */
export type ProviderId =
  | "google"
  | "elevenlabs"
  | "openai"
  | "voicevox"
  | "aivis"
  | "gemini";

/**
 * TTS API リクエストのボディの型
 */
export interface TTSRequestBody {
  text: string;
  provider: ProviderId;
  voice: string;
  model_id?: string; // ElevenLabsやOpenAIなどで使用するモデルID (オプショナル)
  instruction?: string; // Gemini TTSやOpenaAIで使用するインストラクション (オプショナル)
  temperature?: number; // Gemini TTSで使用する温度 (オプショナル)
}

/**
 * TTS API レスポンスの型 (エラー時)
 */
export interface TTSErrorResponse {
  error: string;
  details?: string; // エラー詳細を追加
}

export interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

export function convertToWav(
  rawData: Uint8Array,
  mimeType: string
): Uint8Array {
  const options = parseMimeType(mimeType);
  const wavHeader = createWavHeader(rawData.length, options);

  const combined = new Uint8Array(wavHeader.length + rawData.length);
  combined.set(wavHeader, 0);
  combined.set(rawData, wavHeader.length);

  return combined;
}

export function parseMimeType(mimeType: string): WavConversionOptions {
  const [fileType, ...params] = mimeType.split(";").map((s) => s.trim());
  const [, format] = fileType.split("/");

  const options: Partial<WavConversionOptions> = {
    numChannels: 1,
    sampleRate: 44100,
    bitsPerSample: 16,
  };

  if (format && format.startsWith("L")) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }

  for (const param of params) {
    const [key, value] = param.split("=").map((s) => s.trim());
    if (key === "rate") {
      options.sampleRate = parseInt(value, 10);
    }
  }

  return options as WavConversionOptions;
}

export function createWavHeader(
  dataLength: number,
  options: WavConversionOptions
): Uint8Array {
  const { numChannels, sampleRate, bitsPerSample } = options;

  // http://soundfile.sapp.org/doc/WaveFormat
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const headerLength = 44;
  const buffer = new ArrayBuffer(headerLength);
  const view = new DataView(buffer);

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(view, 0, "RIFF"); // ChunkID
  view.setUint32(4, 36 + dataLength, true); // ChunkSize
  writeString(view, 8, "WAVE"); // Format
  view.setUint32(12, 16, true); // Subchunk1ID
  view.setUint32(16, 16, true); // Subchunk1Size (PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample
  writeString(view, 36, "data"); // Subchunk2ID
  view.setUint32(40, dataLength, true); // Subchunk2Size

  return new Uint8Array(buffer);
}

// Vercel AI SDKが返す可能性のある音声オブジェクトの型インターフェース
interface AudioObjectWithUint8Array {
  uint8ArrayData: Uint8Array;
  mimeType?: string;
  format?: string;
}

interface AudioObjectWithData {
  data: Uint8Array;
  mimeType?: string;
  contentType?: string;
  format?: string;
}

// 型ガード関数
function isAudioObjectWithUint8Array(
  obj: unknown
): obj is AudioObjectWithUint8Array {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "uint8ArrayData" in obj &&
    (obj as AudioObjectWithUint8Array).uint8ArrayData instanceof Uint8Array
  );
}

function isAudioObjectWithData(obj: unknown): obj is AudioObjectWithData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "data" in obj &&
    (obj as AudioObjectWithData).data instanceof Uint8Array
  );
}

// TTS処理ロジックを関数としてエクスポート
export async function processTtsRequest(
  requestBody: TTSRequestBody,
  env: Env["Bindings"]
): Promise<
  { audioBuffer: ArrayBuffer; contentType: string } | TTSErrorResponse
> {
  const { text, provider, voice, model_id, instruction, temperature } =
    requestBody || {};

  if (!text || !provider || !voice) {
    return { error: "Missing required fields: text, provider, voice" };
  }

  const isLocalDev =
    typeof process !== "undefined" && process.env?.NODE_ENV !== "production";

  const openaiApiKey = isLocalDev
    ? process.env.OPENAI_API_KEY
    : env.OPENAI_API_KEY;
  const elevenlabsApiKey = isLocalDev
    ? process.env.ELEVENLABS_API_KEY
    : env.ELEVENLABS_API_KEY;
  const googleTtsApiKey = isLocalDev
    ? process.env.GOOGLE_TTS_API_KEY
    : env.GOOGLE_TTS_API_KEY;
  const geminiApiKey = isLocalDev
    ? process.env.GEMINI_API_KEY
    : env.GEMINI_API_KEY;

  let speechResult: SpeechResult; // OpenAIの場合のみ使用

  const handleAudioResponse = (
    audioContent: GeneratedAudioFile,
    providerName: string
  ): { audioBuffer: ArrayBuffer; contentType: string } | TTSErrorResponse => {
    let audioData: Uint8Array | null = null;
    let responseMimeType: string | undefined = undefined;
    let responseFormat: string | undefined = undefined;

    if (audioContent instanceof Uint8Array) {
      audioData = audioContent;
    } else if (audioContent instanceof ArrayBuffer) {
      audioData = new Uint8Array(audioContent);
    } else if (isAudioObjectWithUint8Array(audioContent)) {
      audioData = audioContent.uint8ArrayData;
      responseMimeType = audioContent.mimeType;
      responseFormat = audioContent.format;
    } else if (isAudioObjectWithData(audioContent)) {
      audioData = audioContent.data;
      responseMimeType = audioContent.mimeType || audioContent.contentType;
      responseFormat = audioContent.format;
    }

    if (audioData) {
      const arrayBuffer = audioData.buffer.slice(
        audioData.byteOffset,
        audioData.byteOffset + audioData.byteLength
      ) as ArrayBuffer; // ArrayBuffer にキャスト

      let mimeType = responseMimeType || "audio/mpeg";
      let extension =
        responseFormat || mimeType.split("/")[1]?.toLowerCase() || "mp3";

      // extension が使用されていないという ESLint 警告を解消するため、ここで使用する
      // 例えば、ログ出力やファイル名生成などに利用できる
      console.log(`Generated audio with extension: ${extension}`);

      return { audioBuffer: arrayBuffer, contentType: mimeType };
    } else {
      console.error(
        `[${providerName}] Unexpected audio data type/structure. Got:`,
        typeof audioContent,
        JSON.stringify(audioContent)?.substring(0, 500)
      );
      return {
        error: `[${providerName}] Unexpected audio data format from TTS provider.`,
      };
    }
  };

  switch (provider) {
    case "openai": {
      if (!openaiApiKey) {
        const errorMsg = isLocalDev
          ? "OpenAI API key not found in process.env. Make sure it's set in your .env file for local development."
          : "OpenAI API key not configured in Cloudflare environment";
        return { error: errorMsg };
      }

      speechResult = await generateSpeech({
        model: openai.speech(
          (model_id || "tts-1") as "tts-1" | "tts-1-hd" | "gpt-4o-mini-tts"
        ),
        voice: voice as
          | "alloy"
          | "echo"
          | "fable"
          | "onyx"
          | "nova"
          | "shimmer",
        text: text,
        instructions: `${
          instruction
            ? `以下の指示に従って音声を生成してください。 - ${instruction}`
            : undefined
        }`,
      });
      return handleAudioResponse(speechResult.audio, "openai");
    }
    case "elevenlabs": {
      if (!elevenlabsApiKey) {
        const errorMsg = isLocalDev
          ? "ElevenLabs API key not found in process.env. Make sure it's set in your .env file for local development."
          : "ElevenLabs API key not configured in Cloudflare environment";
        return { error: errorMsg };
      }

      const elevenLabsApiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;
      const elevenLabsModelIdToUse = model_id || "eleven_multilingual_v2"; // model_id を使用

      const elevenLabsResponse = await fetch(elevenLabsApiUrl, {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": elevenlabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: elevenLabsModelIdToUse,
        }),
      });

      if (!elevenLabsResponse.ok) {
        const errorBody = await elevenLabsResponse.text();
        console.error(
          `ElevenLabs API error (${elevenLabsResponse.status}):`,
          errorBody
        );
        return {
          error: `ElevenLabs API request failed (${elevenLabsResponse.status})`,
          details: errorBody,
        };
      }

      const audioArrayBuffer = await elevenLabsResponse.arrayBuffer();
      return { audioBuffer: audioArrayBuffer, contentType: "audio/mpeg" };
    }

    case "google": {
      if (!googleTtsApiKey) {
        const errorMsg = isLocalDev
          ? "Google TTS API key not found in process.env. Make sure it's set in your .env file for local development."
          : "Google TTS API key not configured in Cloudflare environment";
        return { error: errorMsg };
      }

      let googleApiUrl =
        "https://texttospeech.googleapis.com/v1/text:synthesize";
      googleApiUrl +=
        (googleApiUrl.includes("?") ? "&" : "?") +
        "key=" +
        encodeURIComponent(googleTtsApiKey);

      const googleRequestBody = {
        input: { text },
        voice: { languageCode: "ja-JP", name: voice }, // voice は 'ja-JP-Neural2-B' など
        audioConfig: { audioEncoding: "MP3" as const }, // MP3形式を指定
      };

      const googleResponse = await fetch(googleApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(googleRequestBody),
      });

      if (!googleResponse.ok) {
        const errorBody = await googleResponse.text();
        console.error(
          `Google TTS API error (${googleResponse.status}):`,
          errorBody
        );
        return {
          error: `Google TTS API request failed (${googleResponse.status})`,
          details: errorBody,
        };
      }

      const googleResponseData = (await googleResponse.json()) as {
        audioContent?: string;
      };

      if (!googleResponseData.audioContent) {
        console.error("Google TTS API did not return audioContent.");
        return { error: "Google TTS API did not return audioContent." };
      }

      // Base64デコード
      // Cloudflare Workersでは Buffer.from(string, 'base64') が使える
      // Node.js環境でも同様
      const audioBuffer = Buffer.from(
        googleResponseData.audioContent,
        "base64"
      );

      return { audioBuffer: audioBuffer.buffer, contentType: "audio/mpeg" };
    }

    case "gemini": {
      if (!geminiApiKey) {
        const errorMsg = isLocalDev
          ? "Gemini API key not found in process.env. Make sure it's set in your .env file for local development."
          : "Gemini API key not configured in Cloudflare environment";
        return { error: errorMsg };
      }

      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
      });

      const config = {
        temperature: temperature !== undefined ? temperature : 0.5, // フロントエンドから送られた temperature を使用
        responseModalities: ["audio"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice,
            },
          },
        },
      };

      const model = "gemini-2.5-flash-preview-tts";
      const contents = [
        {
          parts: [
            {
              text: instruction
                ? `以下の指示に従って音声を生成してください。 ***発話禁止指示:(${instruction})*** \n${text}`
                : text,
            },
          ],
        },
      ];

      try {
        const response = await ai.models.generateContent({
          model,
          config,
          contents,
        });

        const audioData =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        console.log("audioData type", typeof audioData);
        if (!audioData) {
          return { error: "音声データが取得できませんでした。" };
        }

        const audioBuffer = Buffer.from(audioData, "base64");
        return {
          audioBuffer: audioBuffer.buffer,
          contentType: "audio/wav",
        };
      } catch (apiError) {
        console.error("Gemini API呼び出しエラー:", apiError);
        let errorMessage = "音声生成中にエラーが発生しました";

        if (apiError instanceof Error) {
          const errorStr = apiError.toString().toLowerCase();

          if (
            errorStr.includes("api key not valid") ||
            errorStr.includes("invalid_argument")
          ) {
            errorMessage =
              "APIキーが無効です。Google AI Studioで有効なAPIキーを取得し、.envファイルに設定してください。";
          } else if (
            errorStr.includes("permission_denied") ||
            errorStr.includes("forbidden")
          ) {
            errorMessage =
              "APIキーに十分な権限がありません。Google AI Studioでキーの権限を確認してください。";
          } else if (
            errorStr.includes("quota") ||
            errorStr.includes("resource_exhausted")
          ) {
            errorMessage =
              "APIの使用量制限に達しました。しばらく待ってから再試行するか、別のAPIキーを使用してください。";
          } else {
            errorMessage = `音声生成中にエラーが発生しました: ${apiError.message}`;
          }
        }
        return { error: errorMessage };
      }
    }

    default: {
      return { error: `Unsupported provider: ${provider}` };
    }
  }
}

export const app = new Hono<Env>();

// CORSミドルウェア設定
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 600,
  })
);

// ヘルスチェックエンドポイント
app.get("/ping", (c) => {
  return c.json({ message: "pong" });
});

// TTS APIエンドポイント
app.post("/", async (c) => {
  try {
    const requestBody = await c.req.json<TTSRequestBody>();
    const result = await processTtsRequest(requestBody, c.env);

    if ("error" in result) {
      return c.json({ error: result.error, details: result.details }, 500);
    } else {
      c.header("Content-Type", result.contentType);
      c.header("Content-Disposition", `attachment; filename="speech.mp3"`); // filename は適宜変更
      return c.body(result.audioBuffer);
    }
  } catch (error) {
    console.error("TTS API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: `Internal server error: ${errorMessage}` }, 500);
  }
});
