import {
  type EmitContext,
  type Model,
  type ModelProperty,
  type Program,
  type Scalar,
  type Type,
  type Union,
  emitFile,
  resolvePath,
  getDoc,
  getMinLength,
  getMaxLength,
  getPattern,
  getMinValue,
  getMaxValue,
  navigateProgram,
} from "@typespec/compiler";
import {
  getFieldType,
  getTemplate,
  getFieldset,
  isFieldset,
  getConditional,
  getOptions,
  getPlaceholder,
  getFormConfig,
  isFormConfig,
} from "./decorators.js";

// ── Types matching the React FormSchema interface ──────────────────

interface OptionItem {
  label: string;
  value: string;
}

interface ValidatorConfig {
  type: string;
  message?: string;
  value?: unknown;
}

interface ConditionalConfig {
  listen: string;
  operator: "equals" | "notEquals" | "truthy" | "falsy" | "regex" | "contains";
  value?: unknown;
}

interface FieldsetConfig {
  legend?: string;
  fields: string[];
}

interface FieldSchema {
  type: string;
  title?: string;
  description?: string;
  placeholder?: string;
  options?: OptionItem[];
  validators?: ValidatorConfig[];
  conditional?: ConditionalConfig;
  subSchema?: FormSchema;
  template?: string;
}

interface FormSchema {
  schema: Record<string, FieldSchema>;
  fieldsets?: FieldsetConfig[];
  template?: string;
}

// ── Helpers ────────────────────────────────────────────────────────

function mapOperator(op: string | undefined): ConditionalConfig["operator"] {
  switch (op) {
    case "==":
    case "equals":
      return "equals";
    case "!=":
    case "notEquals":
      return "notEquals";
    case "truthy":
      return "truthy";
    case "falsy":
      return "falsy";
    case "regex":
      return "regex";
    case "contains":
      return "contains";
    default:
      return "truthy";
  }
}

function inferFieldType(prop: ModelProperty, program: Program): string {
  const propType = prop.type;

  if (propType.kind === "Scalar") {
    const scalar = propType as Scalar;
    const name = scalar.name;
    switch (name) {
      case "boolean":
        return "Checkbox";
      case "int32":
      case "int64":
      case "float32":
      case "float64":
      case "numeric":
      case "integer":
      case "decimal":
      case "decimal128":
      case "int8":
      case "int16":
      case "uint8":
      case "uint16":
      case "uint32":
      case "uint64":
      case "float":
      case "safeint":
        return "Number";
      case "plainDate":
      case "utcDateTime":
      case "offsetDateTime":
        return "Date";
      case "string":
      case "url":
        return "Text";
      default:
        return "Text";
    }
  }

  if (propType.kind === "Model") {
    return "Object";
  }

  if (propType.kind === "Union") {
    return "Select";
  }

  if (propType.kind === "Enum") {
    return "Select";
  }

  return "Text";
}

function getScalarValidators(prop: ModelProperty, program: Program): ValidatorConfig[] {
  const validators: ValidatorConfig[] = [];

  // Check if property is not optional → required
  if (!prop.optional) {
    validators.push({ type: "required", message: "This field is required" });
  }

  const minLen = getMinLength(program, prop.type);
  if (minLen !== undefined) {
    validators.push({ type: "minLength", value: Number(minLen), message: `Must be at least ${minLen} characters` });
  }

  const maxLen = getMaxLength(program, prop.type);
  if (maxLen !== undefined) {
    validators.push({ type: "maxLength", value: Number(maxLen), message: `Must be at most ${maxLen} characters` });
  }

  const pattern = getPattern(program, prop.type);
  if (pattern) {
    validators.push({ type: "pattern", value: pattern, message: `Must match pattern: ${pattern}` });
  }

  const minVal = getMinValue(program, prop.type);
  if (minVal !== undefined) {
    validators.push({ type: "minValue", value: Number(minVal), message: `Must be at least ${minVal}` });
  }

  const maxVal = getMaxValue(program, prop.type);
  if (maxVal !== undefined) {
    validators.push({ type: "maxValue", value: Number(maxVal), message: `Must be at most ${maxVal}` });
  }

  return validators;
}

function buildFieldSchema(prop: ModelProperty, program: Program): FieldSchema {
  const explicitType = getFieldType(program, prop);
  const fieldType = explicitType ?? inferFieldType(prop, program);

  const field: FieldSchema = { type: fieldType };

  // Title from @doc
  const doc = getDoc(program, prop);
  if (doc) {
    field.title = doc;
  }

  // Placeholder
  const placeholder = getPlaceholder(program, prop);
  if (placeholder) {
    field.placeholder = placeholder;
  }

  // Template
  const template = getTemplate(program, prop);
  if (template) {
    field.template = template;
  }

  // Options from @options decorator
  const opts = getOptions(program, prop);
  if (opts && opts.length > 0) {
    field.options = opts.map((v) => ({ label: v, value: v }));
  }

  // Options from Union type (enum-like)
  if (!field.options && prop.type.kind === "Union") {
    const union = prop.type as Union;
    const unionOpts: OptionItem[] = [];
    for (const variant of union.variants.values()) {
      if (variant.type.kind === "String") {
        const val = (variant.type as any).value as string;
        unionOpts.push({ label: val, value: val });
      }
    }
    if (unionOpts.length > 0) {
      field.options = unionOpts;
    }
  }

  // Options from Enum type
  if (!field.options && prop.type.kind === "Enum") {
    const enumType = prop.type as any;
    const enumOpts: OptionItem[] = [];
    for (const member of enumType.members.values()) {
      const val = member.value ?? member.name;
      enumOpts.push({ label: String(val), value: String(val) });
    }
    if (enumOpts.length > 0) {
      field.options = enumOpts;
    }
  }

  // Conditional
  const cond = getConditional(program, prop);
  if (cond) {
    field.conditional = {
      listen: cond.expression,
      operator: mapOperator(cond.operator),
    };
  }

  // Validators
  const validators = getScalarValidators(prop, program);
  if (validators.length > 0) {
    field.validators = validators;
  }

  // Nested model → subSchema
  if (prop.type.kind === "Model" && !isScalarModel(prop.type)) {
    const subSchema = buildFormSchema(prop.type as Model, program);
    field.subSchema = subSchema;
  }

  return field;
}

function isScalarModel(type: Type): boolean {
  if (type.kind !== "Model") return true;
  const model = type as Model;
  // Built-in models like Array<T> have no properties we want to recurse into
  // Check if it's a TypeSpec built-in by checking namespace
  const ns = model.namespace;
  if (ns && ns.name === "TypeSpec") return true;
  return false;
}

function buildFormSchema(model: Model, program: Program): FormSchema {
  const schema: Record<string, FieldSchema> = {};
  const fieldsets: FieldsetConfig[] = [];
  const fieldsetFields: Set<string> = new Set();

  // Check for fieldset-decorated nested models first
  for (const [name, prop] of model.properties) {
    if (prop.type.kind === "Model" && isFieldset(program, prop.type)) {
      const nestedModel = prop.type as Model;
      const legend = getFieldset(program, nestedModel);
      const fields: string[] = [];

      for (const [nestedName, nestedProp] of nestedModel.properties) {
        schema[nestedName] = buildFieldSchema(nestedProp, program);
        fields.push(nestedName);
        fieldsetFields.add(nestedName);
      }

      fieldsets.push({
        legend: legend || undefined,
        fields,
      });
    }
  }

  // Process regular properties
  for (const [name, prop] of model.properties) {
    if (fieldsetFields.has(name)) continue;
    if (prop.type.kind === "Model" && isFieldset(program, prop.type)) continue;
    schema[name] = buildFieldSchema(prop, program);
  }

  const result: FormSchema = { schema };

  if (fieldsets.length > 0) {
    result.fieldsets = fieldsets;
  }

  // Form-level template
  const formConfig = getFormConfig(program, model);
  if (formConfig?.template) {
    result.template = formConfig.template;
  }

  return result;
}

// ── TypeScript interface emission ──────────────────────────────────

function tsTypeForProperty(prop: ModelProperty, program: Program): string {
  const opts = getOptions(program, prop);

  // Union type → string literal union
  if (prop.type.kind === "Union") {
    const union = prop.type as Union;
    const literals: string[] = [];
    for (const variant of union.variants.values()) {
      if (variant.type.kind === "String") {
        literals.push(`"${(variant.type as any).value}"`);
      }
    }
    if (literals.length > 0) {
      return literals.join(" | ");
    }
  }

  // Enum type → string literal union
  if (prop.type.kind === "Enum") {
    const enumType = prop.type as any;
    const literals: string[] = [];
    for (const member of enumType.members.values()) {
      const val = member.value ?? member.name;
      literals.push(`"${val}"`);
    }
    if (literals.length > 0) {
      return literals.join(" | ");
    }
  }

  // Options decorator → string literal union
  if (opts && opts.length > 0) {
    return opts.map((v) => `"${v}"`).join(" | ");
  }

  // Nested model
  if (prop.type.kind === "Model" && !isScalarModel(prop.type)) {
    return `${(prop.type as Model).name}Values`;
  }

  // Scalar types
  if (prop.type.kind === "Scalar") {
    const scalar = prop.type as Scalar;
    switch (scalar.name) {
      case "boolean":
        return "boolean";
      case "int32":
      case "int64":
      case "float32":
      case "float64":
      case "numeric":
      case "integer":
      case "decimal":
      case "decimal128":
      case "int8":
      case "int16":
      case "uint8":
      case "uint16":
      case "uint32":
      case "uint64":
      case "float":
      case "safeint":
        return "number";
      case "string":
      case "url":
        return "string";
      case "plainDate":
      case "utcDateTime":
      case "offsetDateTime":
        return "string";
      default:
        return "string";
    }
  }

  return "unknown";
}

function emitTypeScriptInterface(model: Model, program: Program): string {
  const lines: string[] = [];
  const nestedInterfaces: string[] = [];

  // Collect nested model interfaces first
  for (const [, prop] of model.properties) {
    if (prop.type.kind === "Model" && !isScalarModel(prop.type)) {
      nestedInterfaces.push(emitTypeScriptInterface(prop.type as Model, program));
    }
    // Fieldset models
    if (prop.type.kind === "Model" && isFieldset(program, prop.type)) {
      // Fieldset properties are flattened, no separate interface needed
    }
  }

  lines.push(`export interface ${model.name}Values {`);
  for (const [name, prop] of model.properties) {
    // Fieldset: flatten properties
    if (prop.type.kind === "Model" && isFieldset(program, prop.type)) {
      const nestedModel = prop.type as Model;
      for (const [nestedName, nestedProp] of nestedModel.properties) {
        const optional = nestedProp.optional ? "?" : "";
        const tsType = tsTypeForProperty(nestedProp, program);
        lines.push(`  ${nestedName}${optional}: ${tsType};`);
      }
      continue;
    }

    const cond = getConditional(program, prop);
    const optional = prop.optional || cond ? "?" : "";
    const tsType = tsTypeForProperty(prop, program);
    lines.push(`  ${name}${optional}: ${tsType};`);
  }
  lines.push(`}`);

  return [...nestedInterfaces, lines.join("\n")].join("\n\n");
}

// ── Meta-schema emission ───────────────────────────────────────────

function buildMetaSchema(): object {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "SubschemaFormSchema",
    description: "JSON Schema describing the Subschema FormSchema format",
    type: "object",
    required: ["schema"],
    properties: {
      schema: {
        type: "object",
        description: "Map of field names to field schema definitions",
        additionalProperties: { $ref: "#/definitions/FieldSchema" },
      },
      fieldsets: {
        type: "array",
        items: { $ref: "#/definitions/FieldsetConfig" },
      },
      template: { type: "string" },
    },
    definitions: {
      FieldSchema: {
        type: "object",
        required: ["type"],
        properties: {
          type: { type: "string", description: "Field type name (e.g. Text, Select, Checkbox)" },
          title: { type: "string" },
          description: { type: "string" },
          placeholder: { type: "string" },
          template: { type: "string" },
          options: { type: "array", items: { $ref: "#/definitions/OptionItem" } },
          validators: { type: "array", items: { $ref: "#/definitions/ValidatorConfig" } },
          conditional: { $ref: "#/definitions/ConditionalConfig" },
          subSchema: { $ref: "#" },
          default: {},
          itemSchema: { $ref: "#/definitions/FieldSchema" },
        },
        additionalProperties: true,
      },
      OptionItem: {
        type: "object",
        required: ["label", "value"],
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
      },
      ValidatorConfig: {
        type: "object",
        required: ["type"],
        properties: {
          type: { type: "string" },
          message: { type: "string" },
          value: {},
        },
      },
      ConditionalConfig: {
        type: "object",
        required: ["listen", "operator"],
        properties: {
          listen: { type: "string" },
          operator: { type: "string", enum: ["equals", "notEquals", "truthy", "falsy", "regex", "contains"] },
          value: {},
        },
      },
      FieldsetConfig: {
        type: "object",
        required: ["fields"],
        properties: {
          legend: { type: "string" },
          fields: { type: "array", items: { type: "string" } },
        },
      },
    },
  };
}

// ── llms.txt emission ──────────────────────────────────────────────

function buildLlmsTxt(): string {
  const lines: string[] = [
    "# Subschema Built-in Types, Validators, and Decorators",
    "",
    "## Field Types",
    "",
    "- Text: Single-line text input. `@field(\"Text\")`",
    "- TextArea: Multi-line text input. `@field(\"TextArea\")`",
    "- Select: Dropdown select. `@field(\"Select\") @options(\"a\", \"b\", \"c\")`",
    "- Radio: Radio button group. `@field(\"Radio\") @options(\"a\", \"b\")`",
    "- Checkbox: Boolean checkbox. `@field(\"Checkbox\")`",
    "- Number: Numeric input. `@field(\"Number\")`",
    "- Date: Date picker. `@field(\"Date\")`",
    "- Password: Password input. `@field(\"Password\")`",
    "- Hidden: Hidden field. `@field(\"Hidden\")`",
    "- Autocomplete: Autocomplete input. `@field(\"Autocomplete\")`",
    "- List: Repeatable list of items. `@field(\"List\")`",
    "- Object: Nested form object (auto-detected for model references).",
    "",
    "## Validators",
    "",
    "- required: Field must have a value. Auto-added for non-optional properties.",
    "- minLength: Minimum string length. `@minLength(3)`",
    "- maxLength: Maximum string length. `@maxLength(100)`",
    "- pattern: Regex pattern match. `@pattern(\".+@.+\\\\..+\")`",
    "- minValue: Minimum numeric value. `@minValue(0)`",
    "- maxValue: Maximum numeric value. `@maxValue(100)`",
    "",
    "## Decorators",
    "",
    "- @field(type): Map property to a field type. `@field(\"Text\")`",
    "- @template(name): Assign rendering template. `@template(\"FloatingLabel\")`",
    "- @fieldset(legend?): Group fields visually. `@fieldset(\"Contact Info\")`",
    "- @conditional(expr, op?): Show/hide based on another field. `@conditional(\"type\", \"==\")`",
    "- @options(...values): Provide select/radio options. `@options(\"a\", \"b\", \"c\")`",
    "- @placeholder(text): Set placeholder text. `@placeholder(\"Enter name...\")`",
    "- @formConfig(template?): Mark model as form root. `@formConfig(\"WizardTemplate\")`",
    "- @doc(text): Set field title/description. `@doc(\"Your full name\")`",
    "",
    "## Example",
    "",
    "```typespec",
    "import \"@subschema/typespec\";",
    "using Subschema;",
    "",
    "@formConfig",
    "model ContactForm {",
    "  @field(\"Text\")",
    "  @doc(\"Your full name\")",
    "  name: string;",
    "",
    "  @field(\"Text\")",
    "  @pattern(\".+@.+\\\\..+\")",
    "  email: string;",
    "",
    "  @field(\"Select\")",
    "  @options(\"General\", \"Support\", \"Sales\")",
    "  subject: string;",
    "",
    "  @field(\"TextArea\")",
    "  @placeholder(\"Enter your message...\")",
    "  message: string;",
    "}",
    "```",
    "",
  ];
  return lines.join("\n");
}

// ── Main emitter ───────────────────────────────────────────────────

export async function $onEmit(context: EmitContext) {
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  const program = context.program;
  const formModels: Model[] = [];

  // Find all models decorated with @formConfig
  navigateProgram(program, {
    model(model) {
      if (isFormConfig(program, model)) {
        formModels.push(model);
      }
    },
  });

  if (formModels.length === 0) {
    // Emit empty schema if no form models found
    await emitFile(program, {
      path: resolvePath(context.emitterOutputDir, "subschema-form.json"),
      content: "{}\n",
    });
    return;
  }

  // Build and emit each form schema
  for (const model of formModels) {
    const formSchema = buildFormSchema(model, program);

    // 1. Emit JSON form schema
    await emitFile(program, {
      path: resolvePath(context.emitterOutputDir, "subschema-form.json"),
      content: JSON.stringify(formSchema, null, 2) + "\n",
    });

    // 2. Emit TypeScript value interfaces
    const tsContent = emitTypeScriptInterface(model, program);
    await emitFile(program, {
      path: resolvePath(context.emitterOutputDir, "subschema-form.ts"),
      content: tsContent + "\n",
    });
  }

  // 3. Emit meta-schema
  const metaSchema = buildMetaSchema();
  await emitFile(program, {
    path: resolvePath(context.emitterOutputDir, "subschema-form.schema.json"),
    content: JSON.stringify(metaSchema, null, 2) + "\n",
  });

  // 4. Emit llms.txt
  const llmsTxt = buildLlmsTxt();
  await emitFile(program, {
    path: resolvePath(context.emitterOutputDir, "llms.txt"),
    content: llmsTxt,
  });
}

