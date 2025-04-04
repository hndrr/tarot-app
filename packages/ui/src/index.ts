export * from "./Button";
// Only export components intended for web consumption from the main entry point
export { TarotCard as TarotCardWeb } from "./TarotCard";

// Native components should be imported directly from their source file path
// e.g., import { TarotCardNative } from "@repo/ui/src/TarotCard.native";
