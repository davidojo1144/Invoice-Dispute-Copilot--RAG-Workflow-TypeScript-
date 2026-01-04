'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../utils/cn';

export function Popover({ children }: { children: React.ReactNode }) {
  return <PopoverPrimitive.Root>{children}</PopoverPrimitive.Root>;
}

export function PopoverTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <PopoverPrimitive.Trigger className={className}>{children}</PopoverPrimitive.Trigger>;
}

export function PopoverContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <PopoverPrimitive.Content
      sideOffset={8}
      className={cn(
        'rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-3 text-sm shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        className
      )}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-white dark:fill-card" />
    </PopoverPrimitive.Content>
  );
}
