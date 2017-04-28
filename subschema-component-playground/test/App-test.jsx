import React, {DOM} from 'react';
import App from 'subschema-component-project/lib/App.jsx';
import expect from 'expect';
import support, {into} from '../../subschema-component-project/test/support';
import  {TestUtils, Simulate, cleanUp} from 'subschema-test-support';
import {unmountComponentAtNode, findDOMNode} from 'react-dom';

import playground from 'subschema-component-playground';

import samples from 'subschema-test-samples';
import {loader} from 'subschema';
const {DownloadButton} = types;
const withType = TestUtils.scryRenderedComponentsWithType;
const withTag = TestUtils.scryRenderedDOMComponentsWithTag;
var {click, change} = Simulate;

describe('App', function () {
    this.timeout(50000);
    var b, f, app, select, buttons, options = [];
    loader.addLoader(playground);

    function sleep(time, value) {
        return new Promise(resolve => setTimeout(resolve, time, value));
    }

    const oOpen = DownloadButton.open;

    function test$open(blob, filename, callback) {
        expect(blob).toExist();
        expect(filename).toExist();
        b = blob;
        f = filename;
        //     oOpen(blob, filename, callback);
    }

    beforeEach(function () {
        types.DownloadButton.open = test$open;

        app = into(<App/>, true);

        buttons = withTag(app, 'button');
        select = withTag(app, 'select')[0];
        options = withTag(app, 'option');
        options.shift();
    });

    afterEach(function () {
        if (app) {
            unmountComponentAtNode(findDOMNode(app).parentElement);
        }
        cleanUp();
    });

    Object.keys(samples).forEach(function (value) {

        it(`should change the option  ${value}`, async function () {
            change(select, {
                target: {
                    value
                }
            });
            await sleep(1500);
        });
        it(`should download page ${value}`, async function () {
            click(buttons[0]);

            await sleep(1000);
            buttons = withTag(app, 'button');
            click(buttons[1]);

            await sleep(1000);
            const downloadBtn = withTag(app, 'button')[1];
            expect(downloadBtn.innerText.trim()).toBe('Preview');
            click(downloadBtn);

            await sleep(1000);
            expect(b).toExist('should have blob');
            expect(f).toExist('should have filename');


            return new Promise((resolve, reject) => {
                const url = URL.createObjectURL(b);
                const other = window.open(url);
                let hasError = false;
                other.onerror = function (e) {
                    console.log('errror for ', value, e);
                    hasError = e;
                    //     other.close();
                    reject(e);
                };

                other.addEventListener("DOMContentLoaded", (event) => {
                    if (!hasError) {
                        event.currentTarget.close();
                        resolve();
                    }
                }, false);
            });
        });
    });
});

