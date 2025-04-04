"use client"; // Assume client component for potential hooks/event handlers

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  // Add other common props as needed
}

export const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  // Base styles
  const baseStyle =
    "font-bold rounded-full transition duration-300 inline-block";

  // Variant styles
  const primaryStyle =
    "bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 text-lg";
  const secondaryStyle = "bg-slate-600 hover:bg-slate-700 text-white py-2 px-6"; // Example secondary style

  // Combine styles
  const combinedClassName = `
    ${baseStyle}
    ${variant === "primary" ? primaryStyle : secondaryStyle}
    ${className || ""}
  `;

  return (
    <button className={combinedClassName.trim()} {...props}>
      {children}
    </button>
  );
};
