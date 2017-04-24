import indexTmpl from './page/index.html.tmpl';
import {source, compile, normalize} from '../compile';
import form from '../form';
export default function (writeFile, options) {
    var sample = options.sample.sample;
    var scripts = options.scripts || (options.scripts = {});

    var src = scripts.source = source(options, function () {
        return `render(${form(options)}, document.getElementById('content'));`;
    });
    scripts.compiled = compile(src).code;
    var content = indexTmpl(options);
    return writeFile('index.html', content);
}