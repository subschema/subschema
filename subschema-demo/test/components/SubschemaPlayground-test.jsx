"use strict";
import React from 'react';
import SubschemaPlayground from '../../src/components/SubschemaPlayground.jsx';
import {into} from 'subschema-test-support';
import expect from 'expect';
import samples from 'subschema-test-support/samples/index';

function addLink(link, type = 'text/css', rel = 'stylesheet') {
    var link = document.createElement('link');
    link.type = type
    link.href = link
    link.rel = rel;
    document.getElementsByTagName("head")[0].appendChild(link);

}
const {Loader} = samples;
describe.only('components/SubschemaPlayground', function () {
    before(function (done) {
        addLink('//cdnjs.cloudflare.com/ajax/libs/codemirror/5.0.0/codemirror.min.css');
        addLink('//cdnjs.cloudflare.com/ajax/libs/codemirror/5.0.0/theme/monokai.min.css');
        done();
    });
    it('should render', function () {
        var sp = into(<SubschemaPlayground schema={Loader.schema} setupTxt={Loader.setupTxt}
                                           formProps={['schema', 'value', 'loader']}
                                           imports={['loader', 'valueManager']}/>, true);
        expect(sp).toExist();
    });
});