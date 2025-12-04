export interface Voice {
  id: string;
  name: string;
}

export interface VoiceVoxStyle {
  id: string;
  name: string;
}
export interface VoiceVoxCharacter {
  name: string;
  speaker_uuid: string;
  styles: VoiceVoxStyle[];
}
export interface Provider {
  id: "google" | "elevenlabs" | "openai" | "voicevox" | "aivis" | "gemini";
  name: string;
  voices: readonly Voice[];
  characters?: VoiceVoxCharacter[]; // VOICEVOXのみ
}

// Provider['id'] を型としてエクスポート
// export type ProviderId = Provider["id"]; // 古い定義を削除

// providers 配列から ProviderId 型を動的に生成
export type ProviderId = (typeof providers)[number]["id"];
export const providers: readonly Provider[] = [
  // Readonly に変更
  {
    id: "gemini",
    name: "Google Gemini TTS",
    voices: [
      { id: "Sulafat", name: "Sulafat (暖かい)" },
      { id: "Zephyr", name: "Zephyr (明るい)" },
      { id: "Puck", name: "Puck (陽気な)" },
      { id: "Charon", name: "Charon (情報豊かな)" },
      { id: "Kore", name: "Kore (しっかりした)" },
      { id: "Fenrir", name: "Fenrir (活発な)" },
      { id: "Leda", name: "Leda (若々しい)" },
      { id: "Orus", name: "Orus (しっかりした)" },
      { id: "Aoede", name: "Aoede (軽快な)" },
      { id: "Callirhoe", name: "Callirhoe (気楽な)" },
      { id: "Autonoe", name: "Autonoe (明るい)" },
      { id: "Enceladus", name: "Enceladus (息遣いのある)" },
      { id: "Iapetus", name: "Iapetus (クリアな)" },
      { id: "Umbriel", name: "Umbriel (気楽な)" },
      { id: "Algieba", name: "Algieba (滑らかな)" },
      { id: "Despina", name: "Despina (滑らかな)" },
      { id: "Erinome", name: "Erinome (クリアな)" },
      { id: "Algenib", name: "Algenib (しわがれた)" },
      { id: "Rasalgethi", name: "Rasalgethi (情報豊かな)" },
      { id: "Laomedeia", name: "Laomedeia (陽気な)" },
      { id: "Achernar", name: "Achernar (柔らかい)" },
      { id: "Alnilam", name: "Alnilam (しっかりした)" },
      { id: "Schedar", name: "Schedar (落ち着いた)" },
      { id: "Gacrux", name: "Gacrux (円熟した)" },
      { id: "Pulcherrima", name: "Pulcherrima (前向きな)" },
      { id: "Achird", name: "Achird (親しみやすい)" },
      { id: "Zubenelgenubi", name: "Zubenelgenubi (カジュアルな)" },
      { id: "Vindemiatrix", name: "Vindemiatrix (穏やかな)" },
      { id: "Sadachbia", name: "Sadachbia (活気のある)" },
      { id: "Sadaltager", name: "Sadaltager (知識豊富な)" },
    ],
  },
  {
    id: "google",
    name: "Google Cloud TTS",
    voices: [
      { id: "ja-JP-Chirp3-HD-Aoede", name: "Chirp3-HD-Aoede (女性)" },
      { id: "ja-JP-Chirp3-HD-Charon", name: "Chirp3-HD-Charon (男性)" },
      { id: "ja-JP-Chirp3-HD-Fenrir", name: "Chirp3-HD-Fenrir (男性)" },
      { id: "ja-JP-Chirp3-HD-Kore", name: "Chirp3-HD-Kore (女性)" },
      { id: "ja-JP-Chirp3-HD-Leda", name: "Chirp3-HD-Leda (女性)" },
      { id: "ja-JP-Chirp3-HD-Orus", name: "Chirp3-HD-Orus (男性)" },
      { id: "ja-JP-Chirp3-HD-Puck", name: "Chirp3-HD-Puck (男性)" },
      { id: "ja-JP-Chirp3-HD-Zephyr", name: "Chirp3-HD-Zephyr (女性)" },
      { id: "ja-JP-Neural2-B", name: "Neural2-B (女性)" },
      { id: "ja-JP-Neural2-C", name: "Neural2-C (男性)" },
      { id: "ja-JP-Neural2-D", name: "Neural2-D (男性)" },
      { id: "ja-JP-Standard-A", name: "Standard-A (女性)" },
      { id: "ja-JP-Standard-B", name: "Standard-B (女性)" },
      { id: "ja-JP-Standard-C", name: "Standard-C (男性)" },
      { id: "ja-JP-Standard-D", name: "Standard-D (男性)" },
      { id: "ja-JP-Wavenet-A", name: "Wavenet-A (女性)" },
      { id: "ja-JP-Wavenet-B", name: "Wavenet-B (女性)" },
      { id: "ja-JP-Wavenet-C", name: "Wavenet-C (男性)" },
      { id: "ja-JP-Wavenet-D", name: "Wavenet-D (男性)" },
    ],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    voices: [
      // TODO: ElevenLabs の利用可能な Voice ID を確認・更新する
      { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Example)" },
      { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Example)" },
      { id: "XB0fDUnXU5powFXDhCwa", name: "sharlotte (Example)" },
      { id: "8EkOjt4xTPGMclNlh1pk", name: "Morioki" },
      { id: "RBnMinrYKeccY3vaUxlZ", name: "Sakura Suzuki" },
      { id: "EXAVITQu4vr4xn8", name: "Mizuki" },
    ],
  },
  {
    id: "openai",
    name: "OpenAI TTS",
    voices: [
      { id: "alloy", name: "Alloy" },
      { id: "ash", name: "Ash" },
      // { id: "ballad", name: "Ballad" },
      { id: "coral", name: "Coral" },
      { id: "echo", name: "Echo" },
      { id: "fable", name: "Fable" },
      { id: "nova", name: "Nova" },
      { id: "onyx", name: "Onyx" },
      { id: "sage", name: "Sage" },
      { id: "shimmer", name: "Shimmer" },
      // { id: "verse", name: "Verse" },
    ],
  },
  {
    id: "voicevox",
    name: "VOICEVOX",
    voices: [],
    characters: [
      {
        name: "四国めたん",
        speaker_uuid: "7ffcb7ce-00ec-4bdc-82cd-45a8889e43ff",
        styles: [
          { id: "2", name: "ノーマル" },
          { id: "0", name: "あまあま" },
          { id: "6", name: "ツンツン" },
          { id: "4", name: "セクシー" },
          { id: "36", name: "ささやき" },
          { id: "37", name: "ヒソヒソ" },
        ],
      },
      {
        name: "ずんだもん",
        speaker_uuid: "388f246b-8c41-4ac1-8e2d-5d79f3ff56d9",
        styles: [
          { id: "3", name: "ノーマル" },
          { id: "1", name: "あまあま" },
          { id: "7", name: "ツンツン" },
          { id: "5", name: "セクシー" },
          { id: "22", name: "ささやき" },
          { id: "38", name: "ヒソヒソ" },
          { id: "75", name: "ヘロヘロ" },
          { id: "76", name: "なみだめ" },
        ],
      },
      {
        name: "春日部つむぎ",
        speaker_uuid: "35b2c544-660e-401e-b503-0e14c635303a",
        styles: [{ id: "8", name: "ノーマル" }],
      },
      {
        name: "雨晴はう",
        speaker_uuid: "3474ee95-c274-47f9-aa1a-8322163d96f1",
        styles: [{ id: "10", name: "ノーマル" }],
      },
      {
        name: "波音リツ",
        speaker_uuid: "b1a81618-b27b-40d2-b0ea-27a9ad408c4b",
        styles: [
          { id: "9", name: "ノーマル" },
          { id: "65", name: "クイーン" },
        ],
      },
      {
        name: "玄野武宏",
        speaker_uuid: "c30dc15a-0992-4f8d-8bb8-ad3b314e6a6f",
        styles: [
          { id: "11", name: "ノーマル" },
          { id: "39", name: "喜び" },
          { id: "40", name: "ツンギレ" },
          { id: "41", name: "悲しみ" },
        ],
      },
      {
        name: "白上虎太郎",
        speaker_uuid: "e5020595-5c5d-4e87-b849-270a518d0dcf",
        styles: [
          { id: "12", name: "ふつう" },
          { id: "32", name: "わーい" },
          { id: "33", name: "びくびく" },
          { id: "34", name: "おこ" },
          { id: "35", name: "びえーん" },
        ],
      },
      {
        name: "青山龍星",
        speaker_uuid: "4f51116a-d9ee-4516-925d-21f183e2afad",
        styles: [
          { id: "13", name: "ノーマル" },
          { id: "81", name: "熱血" },
          { id: "82", name: "不機嫌" },
          { id: "83", name: "喜び" },
          { id: "84", name: "しっとり" },
          { id: "85", name: "かなしみ" },
          { id: "86", name: "囁き" },
        ],
      },
      {
        name: "冥鳴ひまり",
        speaker_uuid: "8eaad775-3119-417e-8cf4-2a10bfd592c8",
        styles: [{ id: "14", name: "ノーマル" }],
      },
      {
        name: "九州そら",
        speaker_uuid: "481fb609-6446-4870-9f46-90c4dd623403",
        styles: [
          { id: "16", name: "ノーマル" },
          { id: "15", name: "あまあま" },
          { id: "18", name: "ツンツン" },
          { id: "17", name: "セクシー" },
          { id: "19", name: "ささやき" },
        ],
      },
      {
        name: "もち子さん",
        speaker_uuid: "9f3ee141-26ad-437e-97bd-d22298d02ad2",
        styles: [
          { id: "20", name: "ノーマル" },
          { id: "66", name: "セクシー／あん子" },
          { id: "77", name: "泣き" },
          { id: "78", name: "怒り" },
          { id: "79", name: "喜び" },
          { id: "80", name: "のんびり" },
        ],
      },
      {
        name: "剣崎雌雄",
        speaker_uuid: "1a17ca16-7ee5-4ea5-b191-2f02ace24d21",
        styles: [{ id: "21", name: "ノーマル" }],
      },
      {
        name: "WhiteCUL",
        speaker_uuid: "67d5d8da-acd7-4207-bb10-b5542d3a663b",
        styles: [
          { id: "23", name: "ノーマル" },
          { id: "24", name: "たのしい" },
          { id: "25", name: "かなしい" },
          { id: "26", name: "びえーん" },
        ],
      },
      {
        name: "後鬼",
        speaker_uuid: "0f56c2f2-644c-49c9-8989-94e11f7129d0",
        styles: [
          { id: "27", name: "人間ver." },
          { id: "28", name: "ぬいぐるみver." },
          { id: "87", name: "人間（怒り）ver." },
          { id: "88", name: "鬼ver." },
        ],
      },
      {
        name: "No.7",
        speaker_uuid: "044830d2-f23b-44d6-ac0d-b5d733caa900",
        styles: [
          { id: "29", name: "ノーマル" },
          { id: "30", name: "アナウンス" },
          { id: "31", name: "読み聞かせ" },
        ],
      },
      {
        name: "ちび式じい",
        speaker_uuid: "468b8e94-9da4-4f7a-8715-a22a48844f9e",
        styles: [{ id: "42", name: "ノーマル" }],
      },
      {
        name: "櫻歌ミコ",
        speaker_uuid: "0693554c-338e-4790-8982-b9c6d476dc69",
        styles: [
          { id: "43", name: "ノーマル" },
          { id: "44", name: "第二形態" },
          { id: "45", name: "ロリ" },
        ],
      },
      {
        name: "小夜/SAYO",
        speaker_uuid: "a8cc6d22-aad0-4ab8-bf1e-2f843924164a",
        styles: [{ id: "46", name: "ノーマル" }],
      },
      {
        name: "ナースロボ＿タイプＴ",
        speaker_uuid: "882a636f-3bac-431a-966d-c5e6bba9f949",
        styles: [
          { id: "47", name: "ノーマル" },
          { id: "48", name: "楽々" },
          { id: "49", name: "恐怖" },
          { id: "50", name: "内緒話" },
        ],
      },
      {
        name: "†聖騎士 紅桜†",
        speaker_uuid: "471e39d2-fb11-4c8c-8d89-4b322d2498e0",
        styles: [{ id: "51", name: "ノーマル" }],
      },
      {
        name: "雀松朱司",
        speaker_uuid: "0acebdee-a4a5-4e12-a695-e19609728e30",
        styles: [{ id: "52", name: "ノーマル" }],
      },
      {
        name: "麒ヶ島宗麟",
        speaker_uuid: "7d1e7ba7-f957-40e5-a3fc-da49f769ab65",
        styles: [{ id: "53", name: "ノーマル" }],
      },
      {
        name: "春歌ナナ",
        speaker_uuid: "ba5d2428-f7e0-4c20-ac41-9dd56e9178b4",
        styles: [{ id: "54", name: "ノーマル" }],
      },
      {
        name: "猫使アル",
        speaker_uuid: "00a5c10c-d3bd-459f-83fd-43180b521a44",
        styles: [
          { id: "55", name: "ノーマル" },
          { id: "56", name: "おちつき" },
          { id: "57", name: "うきうき" },
        ],
      },
      {
        name: "猫使ビィ",
        speaker_uuid: "c20a2254-0349-4470-9fc8-e5c0f8cf3404",
        styles: [
          { id: "58", name: "ノーマル" },
          { id: "59", name: "おちつき" },
          { id: "60", name: "人見知り" },
        ],
      },
      {
        name: "中国うさぎ",
        speaker_uuid: "1f18ffc3-47ea-4ce0-9829-0576d03a7ec8",
        styles: [
          { id: "61", name: "ノーマル" },
          { id: "62", name: "おどろき" },
          { id: "63", name: "こわがり" },
          { id: "64", name: "へろへろ" },
        ],
      },
      {
        name: "栗田まろん",
        speaker_uuid: "04dbd989-32d0-40b4-9e71-17c920f2a8a9",
        styles: [{ id: "67", name: "ノーマル" }],
      },
      {
        name: "あいえるたん",
        speaker_uuid: "dda44ade-5f9c-4a3a-9d2c-2a976c7476d9",
        styles: [{ id: "68", name: "ノーマル" }],
      },
      {
        name: "満別花丸",
        speaker_uuid: "287aa49f-e56b-4530-a469-855776c84a8d",
        styles: [
          { id: "69", name: "ノーマル" },
          { id: "70", name: "元気" },
          { id: "71", name: "ささやき" },
          { id: "72", name: "ぶりっ子" },
          { id: "73", name: "ボーイ" },
        ],
      },
      {
        name: "琴詠ニア",
        speaker_uuid: "97a4af4b-086e-4efd-b125-7ae2da85e697",
        styles: [{ id: "74", name: "ノーマル" }],
      },
      {
        name: "Voidoll",
        speaker_uuid: "0ebe2c7d-96f3-4f0e-a2e3-ae13fe27c403",
        styles: [{ id: "89", name: "ノーマル" }],
      },
      {
        name: "ぞん子",
        speaker_uuid: "0156da66-4300-474a-a398-49eb2e8dd853",
        styles: [
          { id: "90", name: "ノーマル" },
          { id: "91", name: "低血圧" },
          { id: "92", name: "覚醒" },
          { id: "93", name: "実況風" },
        ],
      },
      {
        name: "中部つるぎ",
        speaker_uuid: "4614a7de-9829-465d-9791-97eb8a5f9b86",
        styles: [
          { id: "94", name: "ノーマル" },
          { id: "95", name: "怒り" },
          { id: "96", name: "ヒソヒソ" },
          { id: "97", name: "おどおど" },
          { id: "98", name: "絶望と敗北" },
        ],
      },
    ],
  },
  {
    id: "aivis",
    name: "AIVIS Speech",
    voices: [],
    characters: [
      {
        name: "Anneli",
        speaker_uuid: "e756b8e4-b606-4e15-99b1-3f9c6a1b2317",
        styles: [
          { name: "ノーマル", id: "888753760" },
          { name: "通常", id: "888753761" },
          { name: "テンション高め", id: "888753762" },
          { name: "上機嫌", id: "888753764" },
          { name: "落ち着き", id: "888753763" },
          { name: "怒り・悲しみ", id: "888753765" },
        ],
      },
      {
        name: "Anneli (Alt)",
        speaker_uuid: "9c3114d0-59ce-4576-8110-a6671d3930e1",
        styles: [{ name: "ノーマル", id: "1196801504" }],
      },
      {
        name: "Anneli (Whisper)",
        speaker_uuid: "d4f9bd78-b70f-4d1f-8b52-19df1d5c5586",
        styles: [
          { name: "ノーマル", id: "864870016" },
          { name: "通常", id: "864870017" },
          { name: "テンション高め", id: "864870018" },
          { name: "上機嫌", id: "864870020" },
          { name: "落ち着き", id: "864870019" },
          { name: "怒り・悲しみ", id: "864870021" },
        ],
      },
      {
        name: "ろてじん（長老ボイス）",
        speaker_uuid: "452fee2b-d102-4053-bccd-c0f8c265c147",
        styles: [{ name: "ノーマル", id: "391794336" }],
      },
      {
        name: "morioki",
        speaker_uuid: "396a746d-742f-4e43-b722-1182a7fab9af",
        styles: [{ name: "ノーマル", id: "497929760" }],
      },
      {
        name: "中2",
        speaker_uuid: "27dce2b7-b033-4b82-a722-d18ddba66d94",
        styles: [{ name: "ノーマル", id: "604166016" }],
      },
      {
        name: "桜音",
        speaker_uuid: "91e8582b-daf8-4eb8-9d34-7cffae50d93f",
        styles: [{ name: "ノーマル", id: "376644064" }],
      },
      {
        name: "まい",
        speaker_uuid: "41b7785f-35cc-4089-a360-dd8a63da5e75",
        styles: [{ name: "ノーマル", id: "1431611904" }],
      },
      {
        name: "るな",
        speaker_uuid: "aa63d66e-92fe-499e-9e0d-15dad4a61d0d",
        styles: [{ name: "ノーマル", id: "345585728" }],
      },
      {
        name: "澤原 玄二郎",
        speaker_uuid: "accf08c8-0237-485f-98af-20b71cf2121b",
        styles: [
          { name: "ノーマル", id: "2029042368" },
          { name: "close", id: "2029042369" },
          { name: "close-shout", id: "2029042370" },
          { name: "far", id: "2029042371" },
          { name: "far-shout", id: "2029042372" },
        ],
      },
      {
        name: "阿井田 茂",
        speaker_uuid: "561e4e59-3bc9-4726-9028-44a3c12a6f1d",
        styles: [
          { name: "ノーマル", id: "1310138976" },
          { name: "Calm", id: "1310138977" },
          { name: "Far", id: "1310138978" },
          { name: "Heavy", id: "1310138979" },
          { name: "Mid", id: "1310138980" },
          { name: "Shout", id: "1310138981" },
          { name: "Surprise", id: "1310138982" },
        ],
      },
      {
        name: "あゆ(現実20代女子AIボイチェン~リアボVC公式モデル)",
        speaker_uuid: "179cf479-eb0b-46c3-8cfa-108ec186b555",
        styles: [
          { name: "ノーマル", id: "261761120" },
          { name: "kanasimi_kanasimi", id: "261761121" },
          { name: "uresii_uresii", id: "261761122" },
          { name: "hutuu_hutuu", id: "261761123" },
          { name: "odoroki_odoroki", id: "261761124" },
        ],
      },
      {
        name: "ほのか(現実20代女子AIボイチェン~リアボVC公式モデル)",
        speaker_uuid: "05df32d1-1c20-48d3-860d-83310004e046",
        styles: [
          { name: "ノーマル", id: "808373280" },
          { name: "kanasimi_kanasimi", id: "808373281" },
          { name: "uresii_uresii", id: "808373282" },
          { name: "hutuu_hutuu", id: "808373283" },
          { name: "odoroki_odoroki", id: "808373284" },
        ],
      },
      {
        name: "もえ(現実20代女子AIボイチェン@リアボVC公式モデル)",
        speaker_uuid: "47ddff3b-10b4-48e8-8d5d-692461fa7f96",
        styles: [
          { name: "ノーマル", id: "113804960" },
          { name: "kanasimi_kanasimi", id: "113804961" },
          { name: "uresii_uresii", id: "113804962" },
          { name: "hutuu_hutuu", id: "113804963" },
          { name: "odoroki_odoroki", id: "113804964" },
        ],
      },
      {
        name: "れな(現実20代女子AIボイチェン@リアボVC公式モデル)",
        speaker_uuid: "4a43610f-8ace-4fe2-9541-eb26255f1927",
        styles: [
          { name: "ノーマル", id: "1929056672" },
          { name: "kanasimi_kanasimi", id: "1929056673" },
          { name: "uresii_uresii", id: "1929056674" },
          { name: "hutuu_hutuu", id: "1929056675" },
          { name: "odoroki_odoroki", id: "1929056676" },
        ],
      },
      {
        name: "わかな(現実20代女子AIボイチェン@リアボVC公式モデル)",
        speaker_uuid: "ef92118d-eda3-49d9-858d-1e9ae4dae714",
        styles: [
          { name: "ノーマル", id: "1138003200" },
          { name: "悲しい", id: "1138003201" },
          { name: "嬉しい", id: "1138003202" },
          { name: "普通", id: "1138003203" },
          { name: "驚き", id: "1138003204" },
        ],
      },
    ],
  },
] as const; // as const を維持

// ElevenLabs TTS の設定

// モデル設定
export const ELEVENLABS_MODEL_ID = "eleven_flash_v2_5";
export const ELEVENLABS_VOICE_ID = "8EkOjt4xTPGMclNlh1pk";

// 音声設定
export const ELEVENLABS_VOICE_SPEED = 1.07;
export const ELEVENLABS_VOICE_STABILITY = 0.72;
export const ELEVENLABS_VOICE_SIMILARITY_BOOST = 0.75;
