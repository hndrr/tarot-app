// モバイルアプリで使用する関数のみをエクスポート
export { generateTarotMessageMobile } from "./generateTarotMessageMobile";
export { generateTarotMessageFromWebApi } from "./generateTarotMessageFromWebApi";

// Web側で使用する関数 (必要であれば別途エントリポイントを作成するか、Web側で直接インポートする)
// export { generateTarotMessageWeb } from "./generateTarotMessageWeb";
