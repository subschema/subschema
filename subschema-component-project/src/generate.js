"use strict";

import templates from './templates';
import JSZip from 'jszip';
/**
 * Executes the template with the particular type and returns the output.
 *
 * base64 (default) : the result will be a string, the binary in a base64 form.
 string : the result will be a string in "binary" form, using 1 byte per char (2 bytes).
 uint8array : the result will be a Uint8Array containing the zip. This requires a compatible browser.
 arraybuffer : the result will be a ArrayBuffer containing the zip. This requires a compatible browser.
 blob : the result will be a Blob containing the zip. This requires a compatible browser.
 nodebuffer : the result will be a nodejs Buffer containing the zip. This requires nodejs.
 * @param data
 * @param template
 * @param type
 * @returns {*}
 */
export default function generate(data, template, type) {
    if (typeof template === 'string') {
        template = templates[template];
    }
    if (!template) {
        throw new Error('Must provide a template!');
    }
    if (!type){
        throw new Error('No output type given');
    }
    switch (type) {
        case 'zip-base64':
        case 'zip-string':
        case 'zip-uint8array':
        case 'zip-arraybuffer':
        case 'zip-blob':
        case 'zip-nodebuffer':
        case 'zip':
        case 'nodebuffer':
        {
            type = type.split('-')[1] || 'base64';
            var zip = new JSZip();
            template(zip.file.bind(zip), data);
            return zip.generate({type})
        }
        case 'js-blob':
        case 'html-blob':
        case 'text-blob':
        case 'blob':
        {
            var bType = type.split('-')[0];
            var type = bType ? `text/${bType};charset=utf-8` : 'application/octet-binary';
            var blob = null;
            template(function (filename, content, options) {
                if (blob != null) {
                    throw new Error('Can not write more than one file to a blob, try zip');
                }
                options = options || {};
                options.type = options.type || type;
                blob = new Blob([content], options);
            }, data);
            return blob;
        }
        case 'string':
        {
            var c;
            template(function (filename, content, options) {
                if (c != null) {
                    throw new Error('Can not write more than one file to a string, try zip');
                }
                c = content;
            }, data);
            return c;
        }
        default :
            throw new Error(`No type matched ${type}`)

    }
}