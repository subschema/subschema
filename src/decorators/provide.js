"use strict";
import defaultLoader from '../loader';
import provideFactory from './provideFactory';

const ctx = {defaultLoader};
//export as the default.
const { type, validator, template, processor, operator, schema } = provideFactory(ctx);
ctx.type = type;
ctx.validator = validator;
ctx.template = template;
ctx.processor = processor;
ctx.operator = operator;
ctx.schema = schema;

export default ctx;

export {
    type,
    validator,
    template,
    processor,
    operator,
    schema,
    defaultLoader
};
