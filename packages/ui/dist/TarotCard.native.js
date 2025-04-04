import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, Image } from "react-native";
// Keep the image path resolution logic specific to mobile for now
// This might need adjustment depending on how assets are handled in the monorepo
// Export imagePaths for use in other mobile components if needed
export const imagePaths = {
    fool: require("../../../apps/mobile/src/assets/images/cards/fool.webp"), // Adjust path relative to this file's new location
    magician: require("../../../apps/mobile/src/assets/images/cards/magician.webp"),
    "high-priestess": require("../../../apps/mobile/src/assets/images/cards/high-priestess.webp"),
    empress: require("../../../apps/mobile/src/assets/images/cards/empress.webp"),
    emperor: require("../../../apps/mobile/src/assets/images/cards/emperor.webp"),
    hierophant: require("../../../apps/mobile/src/assets/images/cards/hierophant.webp"),
    lovers: require("../../../apps/mobile/src/assets/images/cards/lovers.webp"),
    chariot: require("../../../apps/mobile/src/assets/images/cards/chariot.webp"),
    strength: require("../../../apps/mobile/src/assets/images/cards/strength.webp"),
    hermit: require("../../../apps/mobile/src/assets/images/cards/hermit.webp"),
    "wheel-of-fortune": require("../../../apps/mobile/src/assets/images/cards/wheel-of-fortune.webp"),
    justice: require("../../../apps/mobile/src/assets/images/cards/justice.webp"),
    "hanged-man": require("../../../apps/mobile/src/assets/images/cards/hanged-man.webp"),
    death: require("../../../apps/mobile/src/assets/images/cards/death.webp"),
    temperance: require("../../../apps/mobile/src/assets/images/cards/temperance.webp"),
    devil: require("../../../apps/mobile/src/assets/images/cards/devil.webp"),
    tower: require("../../../apps/mobile/src/assets/images/cards/tower.webp"),
    star: require("../../../apps/mobile/src/assets/images/cards/star.webp"),
    moon: require("../../../apps/mobile/src/assets/images/cards/moon.webp"),
    sun: require("../../../apps/mobile/src/assets/images/cards/sun.webp"),
    judgement: require("../../../apps/mobile/src/assets/images/cards/judgement.webp"),
    world: require("../../../apps/mobile/src/assets/images/cards/world.webp"),
};
export const TarotCard = ({ card, isReversed }) => {
    // Export named component
    // Resolve image using the mobile-specific path map
    const resolvedImage = imagePaths[card.image];
    if (!resolvedImage) {
        console.warn(`Image not found for card: ${card.image}`);
        // Optionally return a placeholder or null
    }
    return (_jsxs(View, { className: "flex flex-col items-center", children: [_jsx(View, { className: `relative aspect-[2/3] w-64 mb-6 ${isReversed ? "rotate-180" : ""}`, children: resolvedImage && ( // Render image only if found
                _jsx(Image, { source: resolvedImage, className: "w-full h-full rounded-lg shadow-lg", resizeMode: "cover" })) }), _jsx(Text, { className: "text-3xl font-bold mb-3 text-white", children: card.name }), _jsx(Text, { className: "text-xl text-gray-200 mb-3 font-bold", children: isReversed ? "逆位置" : "正位置" }), _jsx(Text, { className: "text-xl text-gray-200 text-center", children: card.meaning })] }));
};
