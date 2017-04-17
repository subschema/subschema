import React, {DOM} from 'react';
import App from '../public/App.jsx';
import expect from 'expect';
import support, {into} from './support';
import TestUtils, {scryRenderedComponentsWithType as withType, scryRenderedDOMComponentsWithTag as withTag, Simulate} from 'react-addons-test-utils';

var {click, change} = Simulate;
describe.skip('App', function () {
    this.timeout(50000);
    var b, f, app, select, buttons, options = [];

    function saveAs(blob, filename) {
        expect(blob).toExist();
        expect(filename).toExist();
        b = blob;
        f = filename;
    }

//    before(function () {
        app = into(<App saveAs={saveAs}/>, true);
        buttons = withTag(app, 'button');
        select = withTag(app, 'select')[0];
        options = withTag(app, 'option');
        options.shift();
  //  });
    //Object.keys(samples)
      ['Loader']  .forEach(function (value) {
//        const value = opt.value;
        it(`should change the option  ${value}`, function () {
            change(select, {
                target: {
                    value
                }
            });
        });
        it(`should download page ${value}`, function (done) {
            click(buttons[0]);

            expect(b).toExist('should have blob');

            expect(f).toExist('should have filename');

            var url = URL.createObjectURL(b), other = window.open(url);

            var err;
            other.onerror = function (e) {
                console.log('errror for ', value, e);
                err = new Error(e);
                done(err);
            };
            other.addEventListener("DOMContentLoaded", (e)=> {
                console.log('content loaded for ', value, e);
                setTimeout(()=> {
                    if (!err) {
                        other.close();
                        done();
                    }
                }, 500);
            }, false);

        });
    });
});

