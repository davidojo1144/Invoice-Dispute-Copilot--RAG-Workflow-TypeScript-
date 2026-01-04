'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../utils/cn';

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  return <TabsPrimitive.Root defaultValue={defaultValue}>{children}</TabsPrimitive.Root>;
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <TabsPrimitive.List className={cn('flex gap-2 mb-3', className)}>{children}</TabsPrimitive.List>;
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-border bg-white dark:bg-card text-sm data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-primary/20"
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <TabsPrimitive.Content value={value} className={cn('rounded-lg border border-gray-200 dark:border-border p-3', className)}>
      {children}
    </TabsPrimitive.Content>
  );
}
