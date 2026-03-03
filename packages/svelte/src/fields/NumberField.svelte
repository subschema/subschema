<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import Input from '../ui/Input.svelte';

  let { name, value, onChange, onBlur, placeholder, disabled }: FieldComponentProps = $props();
</script>

<Input
  id={name}
  {name}
  type="number"
  value={value === '' || value === undefined || value === null ? '' : String(value)}
  oninput={(e) => {
    const v = e.currentTarget.value;
    onChange(v === '' ? '' : Number(v));
  }}
  onblur={onBlur}
  {placeholder}
  {disabled}
/>

