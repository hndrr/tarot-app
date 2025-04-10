import { speak } from "orate";
import { ElevenLabs } from "orate/elevenlabs";
import {
  ELEVENLABS_MODEL_ID,
  ELEVENLABS_VOICE_ID,
  ELEVENLABS_VOICE_SPEED,
  ELEVENLABS_VOICE_STABILITY,
  ELEVENLABS_VOICE_SIMILARITY_BOOST,
} from "@repo/constants";

/**
 * ElevenLabsを使用してテキストを音声に変換する関数
 * @param narrationText 音声に変換するテキスト
 * @returns 音声データのレスポンス
 */
export async function generateSpeech(narrationText: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ElevenLabs API キーが設定されていません");
  }
  const elevenlabsTTS = new ElevenLabs(apiKey);

  return await speak({
    model: elevenlabsTTS.tts(ELEVENLABS_MODEL_ID, ELEVENLABS_VOICE_ID, {
      voice_settings: {
        speed: ELEVENLABS_VOICE_SPEED,
        stability: ELEVENLABS_VOICE_STABILITY,
        similarity_boost: ELEVENLABS_VOICE_SIMILARITY_BOOST,
      },
    }),
    prompt: narrationText,
  });
}
