/** Options for creating a component skeleton */
export interface CreateOptions {
  /** Component name in PascalCase (e.g. "Rating") */
  name: string;
  /** Kind of component to scaffold */
  kind: 'field' | 'template' | 'validator';
  /** Custom props for the component */
  props?: Record<string, { type: string; default?: unknown }>;
  /** Output directory for the generated package */
  outputDir: string;
}

/** Resolved template data used by all generators (single source of truth) */
export interface TemplateData {
  /** PascalCase component name (e.g. "Rating") */
  name: string;
  /** camelCase component name (e.g. "rating") */
  nameCamel: string;
  /** Suffix based on kind (e.g. "Field", "Template", "Validator") */
  kindSuffix: string;
  /** Full component name with suffix (e.g. "RatingField") */
  fullName: string;
  /** Component kind */
  kind: 'field' | 'template' | 'validator';
  /** Props definitions */
  props: PropDef[];
  /** Package name (kebab-case with suffix) */
  packageName: string;
}

export interface PropDef {
  name: string;
  type: string;
  default?: unknown;
  hasDefault: boolean;
}
