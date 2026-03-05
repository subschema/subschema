# @subschema/core

## 1.0.0

### Major Changes

- dc1e101: Release version 5.0.0 — multi-framework form engine with React, React Native, and Svelte support
  - `@subschema/core`: framework-agnostic types, validators, conditions, and registry
  - `@subschema/react`: React form engine built on core
  - `@subschema/react-native`: React Native form engine with NativeWind styling
  - `@subschema/svelte`: Svelte 5 runes-based form engine
  - `@subschema/create`: project scaffolding CLI
  - `@subschema/typespec`: TypeSpec integration for schema generation

### Minor Changes

- b7b28dd: Extract shared logic into @subschema/core, add @subschema/svelte package with Svelte 5 form engine
  - New `@subschema/core` package with framework-agnostic types, validators, conditions, and registry logic
  - New `@subschema/svelte` package with Svelte 5 runes-based form engine, 13 field types, 8 UI primitives
  - Refactored `@subschema/react` to import shared logic from `@subschema/core`
