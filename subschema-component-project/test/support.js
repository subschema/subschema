import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {TestUtils} from 'subschema-test-support';
import samples from 'subschema-test-samples';
import  {newSubschemaContext} from 'subschema';
import {compile, source} from '../src/compile';
import expect from 'expect';


export function execMock(gen) {
    var exports = {};

    new Function(['exports', 'require'], gen.code)(exports, newSubschemaContext().importer);
    return exports.default;
}

export function into(node, debug) {
    if (debug === true) {
        debug = document.createElement('div');
        document.body.appendChild(debug)
        return render(node, debug);
    }
    return TestUtils.renderIntoDocument(node);
}

export function renderProject(sample) {

}

export function renderPage(sample, verify) {
    const Subschema = newSubschemaContext();
    const {loader, Form, ValueManager} = Subschema;
    var ds = setupData(sample),
        src = compile(source(ds)).code;

    var f = new Function(['render', 'require', 'document'], src);
    var didRender = false;
    f(function (node) {
        didRender = true;
        verify(node);
    }, Subschema.importer, {
        getElementById(id){
            expect(id).toBe('content', 'document.getElementById was "content"');
        }
    });
    expect(didRender).toBe(true, 'Should have called the render method');
}

export async function testEachSample(fn, samplesKeys = Object.keys(samples)) {
    samplesKeys = Array.isArray(samplesKeys) ? samplesKeys : samplesKeys == null ? [] : [samplesKeys];
    samplesKeys.forEach(async function (sample) {
        await fn(setupData(samples[sample]), sample);
    });
}

export function setupData(sample) {
    return {
        schema: {},
        title: 'Hello',
        demo: 'what',
        jsName: 'uhhu',
        project: {
            name: 'hello'
        },
        sample: {sample}
    }
}

export default {
    into,
    renderProject,
    renderPage,
    testEachSample,
    execMock,
    setupData
}