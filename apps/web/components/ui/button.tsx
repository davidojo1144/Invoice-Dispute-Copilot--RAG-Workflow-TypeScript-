import { cn } from '../utils/cn';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-blue-500',
        secondary: 'bg-card text-fg hover:bg-[#1a2330] border border-border',
        outline: 'border border-border bg-transparent text-fg hover:bg-card'
      },
      size: {
        default: 'h-9 px-3 py-1.5',
        sm: 'h-8 px-2',
        lg: 'h-10 px-4'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
