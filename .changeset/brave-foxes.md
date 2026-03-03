---
'@subschema/core': minor
'@subschema/svelte': minor
'@subschema/react': minor
---

Extract shared logic into @subschema/core, add @subschema/svelte package with Svelte 5 form engine

- New `@subschema/core` package with framework-agnostic types, validators, conditions, and registry logic
- New `@subschema/svelte` package with Svelte 5 runes-based form engine, 13 field types, 8 UI primitives
- Refactored `@subschema/react` to import shared logic from `@subschema/core`
