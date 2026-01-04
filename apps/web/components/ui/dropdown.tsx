'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Dropdown({
  trigger,
  items
}: {
  trigger: React.ReactNode;
  items: Array<{ label: string; onClick?: () => void }>;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={8}
        className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card text-sm shadow-md p-1"
      >
        {items.map((it, i) => (
          <DropdownMenu.Item
            key={i}
            className="px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-primary/20 cursor-pointer"
            onClick={it.onClick}
          >
            {it.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
