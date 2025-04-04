import { ImageSourcePropType } from "react-native";
import type { TarotCard as TarotCardType } from "@repo/types";
type TarotCardProps = {
    card: TarotCardType;
    isReversed: boolean;
};
export declare const imagePaths: {
    [key: string]: ImageSourcePropType;
};
export declare const TarotCard: ({ card, isReversed }: TarotCardProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TarotCard.native.d.ts.map