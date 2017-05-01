import indexTmpl from './page/index.html.tmpl';
import {source, compile, normalize} from '../compile';
import form from '../form';
export default function (writeFile, options) {
    const scripts = options.scripts || (options.scripts = {});

    scripts.source = source(options, () => `render(${form(options)}, document.getElementById('content'));`);
    scripts.compiled = compile(scripts.source).code;

    return writeFile('index.html', indexTmpl(options));
}