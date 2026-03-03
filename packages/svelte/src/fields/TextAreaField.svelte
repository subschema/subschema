<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import Textarea from '../ui/Textarea.svelte';

  let { name, value, onChange, onBlur, placeholder, disabled }: FieldComponentProps = $props();
</script>

<Textarea
  id={name}
  {name}
  value={String(value ?? '')}
  oninput={(e) => onChange(e.currentTarget.value)}
  onblur={onBlur}
  {placeholder}
  {disabled}
/>

