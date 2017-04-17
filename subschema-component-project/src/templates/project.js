"use strict";

import templates from "./project/index";
import {source} from "../compile";
import pkg from "../../../subschema/package.json";
export default function (writeFile, data, type = "blob") {
    var scripts = data.scripts || (data.scripts = {});
    data.pkg = pkg;
    var project = data.project = data.project || (data.project = {});
    project.version = project.version || '0.0.1';

    scripts.form = source(data.sample, data.useData, data.useError, null, pkg);
    return Promise.all(Object.keys(templates).map(function (key) {
        var content = templates[key](data)
        return writeFile(key, content);
    }));
}