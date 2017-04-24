"use strict";

import {transform} from "babel-standalone";
import {tutils} from "Subschema";
import form from "./form";
const {each} = tutils;
const babelrc = {
    "presets": [
        "es2015",
        "react",
        "stage-0"
    ]
};


export function stringify(obj) {

    return !obj ? 'null' : JSON.stringify(obj, null, 2)

}


export function normalize(options) {
    const {setupTxt = '', data, errors, schema} = options.sample.sample;

    var imports = '';
    var restOfCode = setupTxt.split("\n").map(function (v) {
        return v.replace(/^\s*import\s+?(.+?);?\s*$/, function (all, imp) {
            imports += `import ${imp};\n`;
            return '';

        });
    }).join("\n");

    return `
import React from 'react';    
import {Form} from 'subschema';    
import {render} from 'react-dom';
    
${imports}\n
    
const schema = ${stringify(schema)};
    
${options.useData ? `let value = ${stringify(data)};` : ''}
${options.useErrors ? `let errors = ${stringify(errors)};` : ''}

${restOfCode}

\n`;
}

export function source(managed, template = form) {
    const codeText = normalize(managed);
    const formText = template ? template(managed) : '';
    return `${codeText}\n${formText}`;

}

export function compile(src) {
    return transform(src, babelrc);
}
