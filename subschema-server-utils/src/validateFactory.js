"use strict";
//This allows for shimming to work. Super Fragilistic.
import {ValueManager, resolvers, warning, tutils} from "Subschema";

const {loadOperator} = resolvers.operator;
const {createValidator} = resolvers.validate;
const {normalize} = resolvers.schema;
const {normalizeFieldsets} = resolvers.fieldset;
const {unique, noop} = tutils;
const join = tutils.path;

const conditionalSettings = {
    operator: "truthy"
};

const returnTrue = _ => true;


function makeConditional(listen, operator, context) {
    if (operator == null) {
        return null;
    }
    const conditional = typeof operator === 'string' ? {
        ...conditionalSettings,
        operator
    } : {...conditionalSettings, listen, ...operator};

    const _operator = loadOperator(conditional.operator, null, null, context);
    if (!_operator) {
        return;
    }
    return function conditional$(valueManager) {
        return _operator(valueManager.path(conditional.listen || listen), conditional.value);
    }
}
function truthy(f) {
    return !!f;
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
            const promises = Object.keys(validatorMap).map((key)=> {
                const pkey = join(pt, key);
                const field = validatorMap[key];
                if (field.conditional(valueManager)) {
                    const validators = field.validator(valueManager.path(pkey), valueManager) || [];

                    return Promise.all(validators).then((error)=> {
                        error = error && error.filter(truthy)
                        if (error.length) {
                            errors[pkey] = error;
                        }
                        return error;
                    }).then(()=>field.children(valueManager, errors));
                }
            });
            return Promise.all(promises).then((result)=> {
                return Object.keys(errors).length === 0 ? null : errors;
            });
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