Subschema 0.1x -> 0.2 Upgrade Guide
---

##Dependencies
 * now requires react-0.14

## API Breakage
 * Components that use BasicFieldMixin (Perhaps Transitively) need to use this.triggerUpdate rather than this.props.handleChange.
 