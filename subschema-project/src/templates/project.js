import templates from "./project/index";
import {source} from "../compile";
import pkg from "../../package.json";
import form from '../form';

export default function (writeFile, data) {
    const scripts = data.scripts || (data.scripts = {});
    data.pkg = pkg;
    const project = data.project = data.project || (data.project = {});
    project.version = project.version || '0.0.1';

    scripts.source = source(data, null);
    scripts.form = form(data);
    return Promise.all(Object.keys(templates).map(function (key) {
        return writeFile(key, templates[key](data));
    }));
}