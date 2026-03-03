<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import Input from '../ui/Input.svelte';

  let { name, value, onChange, onBlur, placeholder, disabled }: FieldComponentProps = $props();
</script>

<Input
  id={name}
  {name}
  type="date"
  value={value ? String(value) : ''}
  oninput={(e) => onChange(e.currentTarget.value)}
  onblur={onBlur}
  {placeholder}
  {disabled}
/>

