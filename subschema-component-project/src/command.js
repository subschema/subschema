"use strict";

import samples from "subschema-test-support-samples";
import generate from "./generate";
import fs from "fs";
import camelCase from "lodash/string/camelCase";
import kebabCase from "lodash/string/kebabCase";

function help(error) {
    var code = 0;
    if (error) {
        code = 1;
        console.error(`ERROR: ${error}`);
    }
    console.error(`
Subschema Project Setup
-----------------------
\v-h\t--help\t\tThis helpful message
\v-t\t--template\t\tWhat to use as default template (Basic).
\v-l\t\--list\t\tLists available templates.
name-of-project
`);
    process.exit(code);
}

function list() {
    console.log(Object.keys(samples).map(v=> {
        return `\v${v}\t-\t${samples[v].description}`;
    }).join('\n'));

    process.exit(0);
}

function handleArgs(args) {
    if (args.length === 0) {
        return help();
    }
    var filename = args.pop();
    if (!filename) {
        help('need at leat a filename');
        process.exit(1);
        return;
    }
    var sample = samples['Basic'];
    for (var i = 0, l = args.length; i < l; i++) {
        var arg = args[i];
        if (/^-h|--help$/.test(arg)) return help();
        if (/^-l|--list$/.test(arg)) return list();
        if (/^(-t|--template(=.*)?)$/.test(arg)) {
            var key = arg.split('=', 2)[1] || args[++i];
            sample = samples[key];
            if (!config) {
                help(`Invalid Project Template: "${key}"`)
            }
        } else {
            help(`Unknown option "${arg}"`)
        }
    }

    writeFile(filename, generate({
        jsName: camelCase(filename),
        title: filename,
        project: {
            name: kebabCase(filename),
            description: sample.description,
            version: '1.0.0'
        },
        demo: {},
        schema: sample.schema,
        sample
    }, 'project', 'nodebuffer'))

}

function writeFile(filename, content, options) {

    fs.writeFile(filename + ".zip", content, function (err) {
        if (err) {
            console.warn('error', err);
            process.exit(1);
        }
        console.log('wrote', filename + '.zip')
        process.exit(0);
    });

}

function readPkg() {
    try {
        var pkg = require('./package.json')
    } catch (e) {
        help('No package.json found, consider running "npm init" to create one ');
    }
    return pkg;
}

if (require.main === module) {
    handleArgs(process.argv.slice(2));

} else {
    module.exports = handleArgs;
}
