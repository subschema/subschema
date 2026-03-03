<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import Input from '../ui/Input.svelte';
  import { cn } from '../ui/utils.js';

  let { name, value, onChange, onBlur, options, placeholder, disabled }: FieldComponentProps = $props();

  let open = $state(false);
  let search = $state(String(value ?? ''));

  const filtered = $derived(
    (options ?? []).filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  function handleSelect(optValue: string, optLabel: string) {
    onChange(optValue);
    search = optLabel;
    open = false;
  }
</script>

<div class="relative">
  <Input
    id={name}
    {name}
    value={search}
    oninput={(e) => {
      search = e.currentTarget.value;
      open = true;
    }}
    onfocus={() => (open = true)}
    onblur={() => {
      setTimeout(() => {
        open = false;
        onBlur();
      }, 200);
    }}
    {placeholder}
    {disabled}
    autocomplete="off"
  />
  {#if open && filtered.length > 0}
    <div
      class={cn(
        'bg-popover text-popover-foreground absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border p-1 shadow-md',
      )}
    >
      {#each filtered as opt}
        <button
          type="button"
          class={cn(
            'hover:bg-accent hover:text-accent-foreground w-full cursor-default rounded-sm px-2 py-1.5 text-left text-sm',
            value === opt.value && 'bg-accent',
          )}
          onmousedown={(e) => { e.preventDefault(); handleSelect(opt.value, opt.label); }}
        >
          {opt.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

