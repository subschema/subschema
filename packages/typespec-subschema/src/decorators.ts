import type { DecoratorContext, Model, ModelProperty, Program, Type } from '@typespec/compiler';
import { setTypeSpecNamespace } from '@typespec/compiler';
import { StateKeys, reportDiagnostic } from './lib.js';

// ── @field(type: string) ──────────────────────────────────────────────
export function $field(context: DecoratorContext, target: ModelProperty, fieldType: string) {
  if (!fieldType) {
    reportDiagnostic(context.program, {
      code: 'invalid-field-type',
      target: context.getArgumentTarget(0)!,
    });
    return;
  }
  context.program.stateMap(StateKeys.field).set(target, fieldType);
}

export function getFieldType(program: Program, target: Type): string | undefined {
  return program.stateMap(StateKeys.field).get(target);
}

// ── @template(name: string) ──────────────────────────────────────────
export function $template(context: DecoratorContext, target: ModelProperty | Model, name: string) {
  if (!name) {
    reportDiagnostic(context.program, {
      code: 'invalid-template-name',
      target: context.getArgumentTarget(0)!,
    });
    return;
  }
  context.program.stateMap(StateKeys.template).set(target, name);
}

export function getTemplate(program: Program, target: Type): string | undefined {
  return program.stateMap(StateKeys.template).get(target);
}

// ── @fieldset(legend?: string) ───────────────────────────────────────
export function $fieldset(context: DecoratorContext, target: Model, legend?: string) {
  context.program.stateMap(StateKeys.fieldset).set(target, legend ?? '');
}

export function getFieldset(program: Program, target: Type): string | undefined {
  return program.stateMap(StateKeys.fieldset).get(target);
}

export function isFieldset(program: Program, target: Type): boolean {
  return program.stateMap(StateKeys.fieldset).has(target);
}

// ── @conditional(expression: string, operator?: string) ──────────────
export interface ConditionalMetadata {
  expression: string;
  operator?: string;
}

export function $conditional(
  context: DecoratorContext,
  target: ModelProperty,
  expression: string,
  operator?: string,
) {
  if (!expression) {
    reportDiagnostic(context.program, {
      code: 'invalid-conditional',
      target: context.getArgumentTarget(0)!,
    });
    return;
  }
  const metadata: ConditionalMetadata = { expression };
  if (operator) {
    metadata.operator = operator;
  }
  context.program.stateMap(StateKeys.conditional).set(target, metadata);
}

export function getConditional(program: Program, target: Type): ConditionalMetadata | undefined {
  return program.stateMap(StateKeys.conditional).get(target);
}

// ── @options(values: string[]) ───────────────────────────────────────
export function $options(context: DecoratorContext, target: ModelProperty, ...values: string[]) {
  if (values.length === 0) {
    reportDiagnostic(context.program, {
      code: 'invalid-options',
      target: context.getArgumentTarget(0)!,
    });
    return;
  }
  context.program.stateMap(StateKeys.options).set(target, values);
}

export function getOptions(program: Program, target: Type): string[] | undefined {
  return program.stateMap(StateKeys.options).get(target);
}

// ── @placeholder(text: string) ───────────────────────────────────────
export function $placeholder(context: DecoratorContext, target: ModelProperty, text: string) {
  if (!text) {
    reportDiagnostic(context.program, {
      code: 'invalid-placeholder',
      target: context.getArgumentTarget(0)!,
    });
    return;
  }
  context.program.stateMap(StateKeys.placeholder).set(target, text);
}

export function getPlaceholder(program: Program, target: Type): string | undefined {
  return program.stateMap(StateKeys.placeholder).get(target);
}

// ── @formConfig(template?: string) ───────────────────────────────────
export interface FormConfigMetadata {
  template?: string;
}

export function $formConfig(context: DecoratorContext, target: Model, template?: string) {
  const metadata: FormConfigMetadata = {};
  if (template) {
    metadata.template = template;
  }
  context.program.stateMap(StateKeys.formConfig).set(target, metadata);
}

export function getFormConfig(program: Program, target: Type): FormConfigMetadata | undefined {
  return program.stateMap(StateKeys.formConfig).get(target);
}

export function isFormConfig(program: Program, target: Type): boolean {
  return program.stateMap(StateKeys.formConfig).has(target);
}

// Bind all decorator implementations to the Subschema namespace
setTypeSpecNamespace(
  'Subschema',
  $field,
  $template,
  $fieldset,
  $conditional,
  $options,
  $placeholder,
  $formConfig,
);
