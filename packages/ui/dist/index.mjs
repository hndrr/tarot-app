// src/Button.tsx
import { jsx } from "react/jsx-runtime";
var Button = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  const baseStyle = "font-bold rounded-full transition duration-300 inline-block";
  const primaryStyle = "bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 text-lg";
  const secondaryStyle = "bg-slate-600 hover:bg-slate-700 text-white py-2 px-6";
  const combinedClassName = `
    ${baseStyle}
    ${variant === "primary" ? primaryStyle : secondaryStyle}
    ${className || ""}
  `;
  return /* @__PURE__ */ jsx("button", { className: combinedClassName.trim(), ...props, children });
};

// src/TarotCard.tsx
import Image from "next/image";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var TarotCard = ({ card, isReversed }) => {
  const imageSrc = card.image.startsWith("/") ? card.image : `/assets/cards/${card.image}.webp`;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsx2(
      "div",
      {
        className: `relative aspect-[2/3] w-64 mb-6 ${isReversed ? "rotate-180" : ""}`,
        children: /* @__PURE__ */ jsx2(
          Image,
          {
            src: imageSrc,
            alt: card.name,
            fill: true,
            className: "rounded-lg object-cover shadow-lg",
            priority: true
          }
        )
      }
    ),
    /* @__PURE__ */ jsx2("h3", { className: "text-3xl font-bold mb-3", children: card.name }),
    /* @__PURE__ */ jsx2("span", { className: "text-xl text-gray-200 mb-3 font-bold", children: isReversed ? "\u9006\u4F4D\u7F6E" : "\u6B63\u4F4D\u7F6E" }),
    /* @__PURE__ */ jsx2("p", { className: "text-xl text-gray-200", children: card.meaning })
  ] });
};
export {
  Button,
  TarotCard as TarotCardWeb
};
