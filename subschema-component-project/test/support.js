"use strict";
import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import samples from 'subschema-test-samples';
import  {newSubschemaContext} from 'Subschema';
import {compile, source} from '../src/compile';
import expect from 'expect';


export function execMock(gen) {
    var exports = {};
    new Function(['exports', 'require'], gen.code)(exports, mockRequire);
    return exports.default;
}
export function mockRequire(mod) {
    if (mod == 'hello') {
        return {};
    }
    if (mod == 'react') {
        return React;
    }
    if (mod == 'react-dom') {
        return ReactDOM;
    }
    if (mod == 'Subschema') {
        return newSubschemaContext();
    }
    if (window && window[mod]) {
        return window[mod];
    }
    throw new Error(`Unknown module "${mod}"`)
};

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
    const {loader, Form, ValueManager}  = Subschema;
    var ds = setupData(sample),
        src = compile(source(ds.sample)).code,
        f = new Function(['render', 'React', 'Subschema', 'loader', 'Form', 'ValueManager', 'document'], src);
    var didRender = false;
    f(function (node) {
        didRender = true;
        verify(node);
    }, React, Subschema, loader, Form, ValueManager, {
        getElementById(id){
            expect(id).toBe('content', 'document.getElementById was "content"');
        }
    });
    expect(didRender).toBe(true, 'Should have called the render method');
}

export function testEachSample(fn, samplesKeys = Object.keys(samples)) {
    samplesKeys = Array.isArray(samplesKeys) ? samplesKeys : samplesKeys == null ? [] : [samplesKeys];
    samplesKeys.forEach(function (sample) {
        fn(setupData(samples[sample]), sample);
    });
}

export function setupData(fix) {
    var {setupFile, ...sample} = fix;
    return {
        schema: {},
        title: 'Hello',
        demo: 'what',
        jsName: 'uhhu',
        project: {
            name: 'hello'
        },
        sample
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