import React, {Component} from 'react';
import { loaderFactory, decorators, loader as origLoader} from 'Subschema';
import expect from 'expect';

const provide = decorators.provide;

describe('decorators.provide', function () {
    this.timeout(50000);
    var loader;

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

        var Postfix = test.substring(0, 1).toUpperCase() + test.substring(1), method = 'load' + Postfix;
        it(`should add ${test}`, function () {

            @decorator
            class NewType extends Component {

            }
            var Nt = loader[method]('NewType');
            expect(Nt).toBe(NewType);


        })
        it(`should add ${test} with custom name `, function () {

            @decorator("Something")
            class NewNewType extends Component {

            }
            var Nt = loader[method]('Something');
            expect(Nt).toBe(NewNewType);

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

            var TT = loader[method]('test');
            expect(TT).toBe(TestClass);

            var OT = loader[method]('other');
            expect(OT).toBe(TestClass);

            var OT = loader[method]('whatever');
            expect(OT).toBe(TestClass);

            var list = loader['list' + Postfix + 's']();
            expect(list.length).toBe(3);
            expect(list[0].name).toBe('whatever');

        });
    });
});