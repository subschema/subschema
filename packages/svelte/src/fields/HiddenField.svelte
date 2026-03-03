<script lang="ts">
  import type { FieldComponentProps } from '../types.js';

  let { name, value }: FieldComponentProps = $props();
</script>

<input type="hidden" {name} value={String(value ?? '')} />

