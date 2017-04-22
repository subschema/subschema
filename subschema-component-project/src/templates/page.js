import indexTmpl from './page/index.html.tmpl';
import {source, compile} from '../compile';

export default function (writeFile, data) {

    var scripts = data.scripts || (data.scripts = {});
    var src = scripts.source = `
import React, {Component} from "react";
import {Form, loader, valueManager, loaderFactory} from "subschema";
import {render} from "react-dom";


${source(data.sample, data.useData, data.useError)}

    `;
    scripts.compiled = compile(src).code;
    var content = indexTmpl(data);
    return writeFile('index.html', content);
}