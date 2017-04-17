"use strict";

import {transform} from "babel-standalone";
import {tutils} from "Subschema";
import formTmpl from "./form.tmpl";
const {each} = tutils;
const babelrc = {
    "presets": [
        "es2015",
        "react",
        "stage-0"
    ]
};


export function stringify(name, obj) {

    var str = obj == null ? 'null' : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}

export function source(managed, useData, useError, template = formTmpl) {
    var {schema, setup, setupTxt, props, data, errors} = managed;
    var valProps = {
        schema,
        value: useData ? data : {},
        errors: useError ? errors : null
    };
    props = props || {};

    var propStr = [], vars = [];

    Object.keys(valProps).forEach(function (v) {
        if (!valProps[v] || props[v]) {
            return;
        }
        vars.push(stringify(v, valProps[v]));
        propStr.push(`${v}={${v}}`);
    });

    each(props, (val, v)=> {
        if (val == true) val = v;
        else val = JSON.stringify(val);
        propStr.push(`${v}={${val}}`);
    });

    var codeText = template ? template({
        setupTxt,
        propStr: propStr.join(' '),
        vars: vars.join('\n')
    }) : {
        setupTxt,
        propStr: propStr.join(' '),
        vars: vars.join('\n')
    };
    return codeText;

}

export function compile(src) {
    return transform(src, babelrc);
}

export function toFunc(transpiled) {
    return new Function(['render', 'React', 'Subschema', 'loader', 'Form', 'ValueManager', 'document'], transpiled.code);

}