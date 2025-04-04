import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { TarotCard as TarotCard$1 } from '@repo/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
}
declare const Button: ({ children, variant, className, ...props }: ButtonProps) => react_jsx_runtime.JSX.Element;

type TarotCardProps = {
    card: TarotCard$1;
    isReversed: boolean;
};
declare const TarotCard: ({ card, isReversed }: TarotCardProps) => react_jsx_runtime.JSX.Element;

export { Button, TarotCard as TarotCardWeb };
