"use strict";
import {React, into, intoWithContext, TestUtils,expect, Simulate, byType, notByType} from '../support';

import {ValueManager, Conditional, loader, decorators} from 'subschema';
var template = decorators.template;
describe('template', function () {
    var context = {
        loader: {
            loadTemplate(templ){
                return templ;
            }
        }
    }
    it('should do a method', function () {

        class Stuff {
            context = context;
            props = {
                junk: 'stuff',
                more: 'than'
            };
            //resulve against props['junk'
            @template('junk', 'more')
            method(first, second) {
                return Array.prototype.slice.call(arguments);
            }
        }
        var s = new Stuff();
        var result = s.method();
        expect(result).toExist();
        expect(result[0]).toEqual('stuff');
        expect(result[1]).toEqual('than');

    });
    it('should default to template', function () {

        class Stuff {
            context = context;

            props = {
                template:'stuff'
            }
            //resolvve against props['junk']
            @template()
            method(first, second) {
                return Array.prototype.slice.call(arguments);
            }
        }
        var s = new Stuff();
        var result = s.method();
        expect(result).toExist();
        expect(result[0]).toEqual('stuff');

    })
    it('should default to template without invoke', function () {

        class Stuff {
            context = context;

            props = {
                template:'stuff'
            }
            //resolvve against props['junk']
            @template
            method(first, second) {
                return Array.prototype.slice.call(arguments);
            }
        }
        var s = new Stuff();
        var result = s.method();
        expect(result).toExist();
        expect(result[0]).toEqual('stuff');

    })

});