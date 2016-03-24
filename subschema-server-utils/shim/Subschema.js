"use strict";
/**
 * This is a shim of just the parts we need from subschema.
 */

import _ValueManager from "subschema/ValueManager";
import {isString, isArray, unique, noop, path} from "subschema/tutils";
import _warning from "subschema/warning";
import _loaderFactory from "subschema/loaderFactory";
import _validators from "subschema/validators";
import {normalize} from "subschema/resolvers/schema";
import {normalizeFieldsets} from "subschema/resolvers/fieldset";
import {createValidator} from "subschema/resolvers/validate";
import {loadOperator} from "subschema/resolvers/operator";

export const loaderFactory = _loaderFactory;

export const validators = _validators;

export const ValueManager = _ValueManager;

export const warning = _warning;

export const tutils = ({
    isString, isArray, unique, noop, path
});

export const resolvers = ({
    schema: {normalize},
    fieldset: {normalizeFieldsets},
    validate: {createValidator},
    operator: {loadOperator}
});

export default ({
    resolvers,
    loaderFactory,
    validators,
    ValueManager
});
