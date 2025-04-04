import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
export const TarotCard = ({ card, isReversed }) => {
    // Export named component
    // Construct the image path assuming it's relative to the public directory
    // This might need adjustment based on final asset location strategy
    const imageSrc = card.image.startsWith("/")
        ? card.image
        : `/assets/cards/${card.image}.webp`;
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `relative aspect-[2/3] w-64 mb-6 ${isReversed ? "rotate-180" : "" // Use ternary for clarity
                }`, children: _jsx(Image, { src: imageSrc, alt: card.name, fill: true, className: "rounded-lg object-cover shadow-lg", priority // Keep priority if needed
                    : true }) }), _jsx("h3", { className: "text-3xl font-bold mb-3", children: card.name }), _jsx("span", { className: "text-xl text-gray-200 mb-3 font-bold", children: isReversed ? "逆位置" : "正位置" }), _jsx("p", { className: "text-xl text-gray-200", children: card.meaning })] }));
};
