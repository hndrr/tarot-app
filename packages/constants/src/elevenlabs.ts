// ElevenLabs TTS の設定

// モデル設定
export const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
// export const ELEVENLABS_VOICE_ID = "8EkOjt4xTPGMclNlh1pk"; // 元の定義をコメントアウトまたは削除

const VOICE_IDS = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Example)" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Example)" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "sharlotte (Example)" },
  { id: "8EkOjt4xTPGMclNlh1pk", name: "Morioki" },
  { id: "RBnMinrYKeccY3vaUxlZ", name: "Sakura Suzuki" },
  { id: "EXAVITQu4vr4xn8", name: "Mizuki" },
];

/**
 * 利用可能な ElevenLabs Voice ID のリストからランダムに1つを選択して返します。
 * @returns ランダムに選択された Voice ID (string)
 */
export const getRandomVoiceId = (): string => {
  const randomIndex = Math.floor(Math.random() * VOICE_IDS.length);
  return VOICE_IDS[randomIndex].id;
};

// 音声設定
export const ELEVENLABS_VOICE_SPEED = 1.09;
export const ELEVENLABS_VOICE_STABILITY = 0.72;
export const ELEVENLABS_VOICE_SIMILARITY_BOOST = 0.75;
