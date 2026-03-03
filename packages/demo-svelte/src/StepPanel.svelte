<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '@subschema/svelte';

  const stepColors: Record<string, string> = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
    emerald: 'bg-emerald-500',
  };

  interface Props {
    step: number;
    title: string;
    subtitle: string;
    color: string;
    children: Snippet;
  }

  let { step, title, subtitle, color, children }: Props = $props();
</script>

<div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
  <div class="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
    <span
      class={cn(
        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
        stepColors[color],
      )}
    >
      {step}
    </span>
    <div>
      <span class="text-sm font-medium">{title}</span>
      <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
    </div>
  </div>
  <div class="p-3">
    {@render children()}
  </div>
</div>

