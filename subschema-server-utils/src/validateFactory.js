"use strict";

import ValueManager from "subschema/ValueManager";
import {normalize} from "subschema/resolvers/schema";
import {normalizeFieldsets} from "subschema/resolvers/fieldset";
import {isString, isArray, unique, noop, path as join} from "subschema/tutils";
import {createValidator} from "subschema/resolvers/validate";
import {loadOperator} from "subschema/resolvers/operator";
import warning from "subschema/warning";


const conditionalSettings = {
    operator: "truthy"
};

const returnTrue = _ => true;

function makeConditional(path, operator, context) {
    if (operator == null) {
        return null;
    }
    const conditional = typeof operator === 'string' ? {
        ...conditionalSettings,
        operator
    } : {...conditionalSettings, listen: path, ...operator};

    const _operator = loadOperator(conditional.operator, null, null, context);
    if (!_operator) {
        return;
    }
    return function conditional$(valueManager) {
        return _operator(valueManager.path(conditional.listen || path), conditional.value);
    }
}
/**
 * Takes a schema and a loader and returns a validator function
 * that takes a value object or a valueManager which then returns
 * an object of errors or null if no errors.
 *
 *
 *
 * @param schema
 * @param loader
 * @returns {*}
 */
export default function validateFactory(schema, loader) {
    const context = {loader};


    function buildFieldsets(schema, path, validatorMap = {}, fields, fieldsets) {
        const normalSchema = normalize(schema, fields, fieldsets, {loader});
        const normalFieldsets = normalizeFieldsets(normalSchema.fieldsets, normalSchema.fields);

        makeFieldsets(normalFieldsets.fieldsets, normalSchema.schema, path, validatorMap);
        return function validate(valueManager = {}, errors = {}, pt) {
            valueManager = typeof valueManager.path === 'function' ? valueManager : ValueManager(valueManager);
            for (let key of Object.keys(validatorMap)) {
                let pkey = join(pt, key);
                const field = validatorMap[key];
                if (field.conditional(valueManager)) {
                    let error = field.validator(valueManager.path(pkey), valueManager);
                    if (error) {
                        errors[pkey] = error;
                    }
                    field.children(valueManager, errors);
                }
            }
            return Object.keys(errors).length === 0 ? null : errors;
        };
    }

    function addEditor(f, field, map, path, validatorMap) {

        if (field == null) {
            warning(true, 'No field found for %s probably a key in fields does not match in schema', f)
            return null;
        }
        const cpath = join(path, typeof f === 'string' ? f : f.name || f);
        validatorMap[cpath] = {
            validator: createValidator(field.validators, cpath, context) || noop,
            conditional: makeConditional(cpath, field.conditional, context) || returnTrue,
            children: field.subSchema ? buildFieldsets(field.subSchema, cpath, {}, field.fields, field.fieldsets) : noop
        };

        if (field.itemType && (field.itemType.schema || field.itemType.subSchema)) {
            const subSchema = field.itemType.schema || field.itemType.subSchema;
            const nested = buildFieldsets(subSchema, null, {}, field.fields, field.fieldsets);
            validatorMap[cpath].children = function (valueManager, errors) {
                const v = valueManager.path(cpath) || [];
                //go over each item in the list and see if its valid.
                for (let i in v) {
                    nested(valueManager, errors, join(cpath, i));
                }
            }
        }
    }

    function makeFields(fields, schema, path, validatorMap) {
        const fieldMap = {};
        const mappedfields = fields.map((field) => {
            var [f, rest] = field.split('.', 2);
            if (rest) {
                (fieldMap[f] || (fieldMap[f] = [])).push(rest);
            }
            return f;
        });

        return unique(mappedfields).map((f, i) => addEditor(f, schema[f] || f, fieldMap[f], path, validatorMap));
    }

    function makeFieldset(f, i, schema, path, validatorMap) {
        return f.fields ? makeFields(f.fields, schema, path, validatorMap) : makeFieldsets(f.fieldsets, schema, path, validatorMap);
    }

    function makeFieldsets(fieldsets, schema, path, validatorMap) {
        if (fieldsets == null) {
            return null;
        }
        return fieldsets.map((f, i)=>makeFieldset(f, i, schema, path, validatorMap));
    }


    return buildFieldsets(schema);

}