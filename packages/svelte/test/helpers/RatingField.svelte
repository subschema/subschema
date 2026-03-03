<script lang="ts">
  let { value }: { name: string; value: unknown; onChange: (v: unknown) => void; onBlur: () => void; fieldSchema: unknown } = $props();
</script>

<div data-testid="rating-field">Rating: {String(value ?? '')}</div>

