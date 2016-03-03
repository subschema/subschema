"use strict";

import React, {Component} from 'react';
import {newSubschemaContext} from 'Subschema';
import expect from 'expect';

describe('decorators.provide', function () {
    this.timeout(500000);
    class TestClass extends Component {

    }
    var loader, provide, decorators;
    beforeEach(function () {
        var ctx = newSubschemaContext([]);
        provide = ctx.decorators.provide;
        loader = ctx.loader;
    });

    for (let test  of ['type', 'validator', 'template', 'processor', 'operator']) {
        it(`${test} should exist`, function () {
            const decorator = provide[test];
            expect(decorator).toExist(`${test} did not exist on ${provide}`);
        });

        const Postfix = test.substring(0, 1).toUpperCase() + test.substring(1), method = 'load' + Postfix;
        it(`should add ${test}`, function () {
            const decorator = provide[test];

            @decorator
            class NewType extends Component {

            }
            var Nt = loader[method]('NewType');
            expect(Nt).toBe(NewType);


        });
        it(`should add ${test} with custom name `, function () {
            const decorator = provide[test];

            @decorator("Something")
            class NewNewType extends Component {

            }
            expect(loader[method]('Something')).toBe(NewNewType);

        });

        it(`should allow for a ${test} factory`, function () {
            const decorator = provide[test];

            class TypeFactory {

                @decorator
                test() {
                    return TestClass;
                }

                @decorator
                other = TestClass;

                @decorator("whatever")
                more = TestClass;

            }

            expect(loader[method]('test')).toBe(TestClass);
            expect(loader[method]('other')).toBe(TestClass);
            expect(loader[method]('whatever')).toBe(TestClass);

            const list = loader['list' + Postfix + 's']();
            expect(list.length).toBe(3);
            expect(list[0].name).toBe('whatever');

        });
    }
});