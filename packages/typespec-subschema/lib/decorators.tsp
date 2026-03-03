import "../dist/src/index.js";

using TypeSpec.Reflection;

namespace Subschema;

/**
 * Maps a model property to a subschema field type.
 * @param type The field type name (e.g. "Text", "Select", "Checkbox", "Date",
 *   "Password", "Number", "TextArea", "Radio", "Hidden", "Autocomplete", "List").
 */
extern dec field(target: ModelProperty, type: valueof string);

/**
 * Assigns a rendering template to a property or model.
 * @param name The template name.
 */
extern dec template(target: ModelProperty | Model, name: valueof string);

/**
 * Marks a model as a fieldset grouping.
 * @param legend Optional legend text displayed for the fieldset.
 */
extern dec fieldset(target: Model, legend?: valueof string);

/**
 * Defines conditional visibility for a property.
 * @param expression The field path or expression to listen to.
 * @param operator Optional comparison operator (e.g. "==", "!=", "truthy").
 */
extern dec conditional(target: ModelProperty, expression: valueof string, operator?: valueof string);

/**
 * Provides options for Select, Radio, or Checkbox fields.
 * @param values The list of option values.
 */
extern dec options(target: ModelProperty, ...values: valueof string[]);

/**
 * Sets placeholder text on a field.
 * @param text The placeholder text.
 */
extern dec placeholder(target: ModelProperty, text: valueof string);

/**
 * Marks a model as the root form schema with optional configuration.
 * @param template Optional template name for the form.
 */
extern dec formConfig(target: Model, template?: valueof string);

