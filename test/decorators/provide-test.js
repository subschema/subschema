import React, {Component} from 'react';
import { loaderFactory, decorators, loader as origLoader} from 'Subschema';
import expect from 'expect';

const provide = decorators.provide;

describe('decorators.provide', function () {
    let loader;
    beforeEach(function () {
        loader = provide.defaultLoader = loaderFactory();
    });
    afterEach(function(){
        loader = origLoader;
    });

    class TestClass extends Component {

    }

    ['type',  'validator', 'template', 'processor', 'operator' ].forEach(function (test) {
        const decorator = provide[test];
        it(`${test} should exist`, function(){
           expect(decorator).toExist(`${test} did not exist on ${provide}`);
        });

        const Postfix = test.substring(0, 1).toUpperCase() + test.substring(1), method = 'load' + Postfix;
        it(`should add ${test}`, function () {

            @decorator
            class NewType extends Component {

            }
            var Nt = loader[method]('NewType');
            expect(Nt).toBe(NewType);


        });
        it(`should add ${test} with custom name `, function () {

            @decorator("Something")
            class NewNewType extends Component {

            }
            expect(loader[method]('Something')).toBe(NewNewType);

        });

        it(`should allow for a ${test} factory`, function () {

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
    });
});