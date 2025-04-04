"use client"; // Assume client component for potential hooks/event handlers
import { jsx as _jsx } from "react/jsx-runtime";
export const Button = ({ children, variant = "primary", className, ...props }) => {
    // Base styles
    const baseStyle = "font-bold rounded-full transition duration-300 inline-block";
    // Variant styles
    const primaryStyle = "bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 text-lg";
    const secondaryStyle = "bg-slate-600 hover:bg-slate-700 text-white py-2 px-6"; // Example secondary style
    // Combine styles
    const combinedClassName = `
    ${baseStyle}
    ${variant === "primary" ? primaryStyle : secondaryStyle}
    ${className || ""}
  `;
    return (_jsx("button", { className: combinedClassName.trim(), ...props, children: children }));
};
