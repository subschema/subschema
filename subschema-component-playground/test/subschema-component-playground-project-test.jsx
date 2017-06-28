import React from 'react';
import playground, {types} from 'subschema-component-playground';
import ProjectWizard, {schema} from 'subschema-component-playground/lib/ProjectWizard';
import  {TestUtils, Simulate, cleanUp, into, expect} from 'subschema-test-support';
import {unmountComponentAtNode, findDOMNode} from 'react-dom';
import samples from 'subschema-test-samples';
import {loader} from 'subschema';
import wizard from 'subschema-component-wizard';


const {DownloadButton} = types;
const withTag = TestUtils.scryRenderedDOMComponentsWithTag;
const {click, change} = Simulate;

//disables transitions so tests run faster (10x faster), by not waiting for transitions.
schema.template = {
    "template": "WizardTemplate",
    "transition": false
};

describe('subschema-component-playground-project-test', function () {
    this.timeout(50000);
    let b, f, app, select, buttons, options = [];

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
    before(function(){
        loader.addLoader(playground);
        loader.addLoader(wizard);
    });
    beforeEach(function () {
        types.DownloadButton.open = test$open;
        if (app) {
            unmountComponentAtNode(findDOMNode(app).parentElement);
        }
        app = into(<ProjectWizard loader={loader}/>, true);

        buttons = withTag(app, 'button');
        select = withTag(app, 'select')[0];
        options = withTag(app, 'option');
        options.shift();
    });



    Object.keys(samples).forEach(function (value) {

        it(`should change the option  ${value}`, async function () {
            change(select, {
                target: {
                    value
                }
            });
        });
        it(`should download page ${value}`, async function () {
            click(buttons[0]);

            buttons = withTag(app, 'button');
            click(buttons[1]);

            const downloadBtn = withTag(app, 'button')[1];
            expect(downloadBtn.innerText.trim()).toBe('Preview');
            click(downloadBtn);

            await sleep(500);
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

