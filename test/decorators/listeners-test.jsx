"use strict";
import {React, into, intoWithContext, TestUtils,expect, Simulate, byType, notByType} from '../support';

import {ValueManager, Conditional, loader, decorators, PropTypes} from 'subschema';
var listeners = decorators.listeners;
describe('decorator.listeners', function () {
    this.timeout(50000);
    it('should listen to events', function () {
        var valueManager = ValueManager();
        var _value = [], _error = [];
        class Test extends React.Component {
            static stuff = {what: true};

            @listeners("error", false)
            error = {
                merror: function (...args) {
                    _error.push(args);
                }
            }

            @listeners
            listen() {
                return {
                    'test': function (...args) {
                        _value.push(args)
                    }
                }
            }


            render() {
                return <div>hello</div>
            }
        }
        var comp = intoWithContext(<Test />, {valueManager});
        expect(valueManager.path('test')).toNotExist();
        valueManager.update('test', 1);

        expect(_value[1][0]).toBe(1);

        valueManager.setErrors({
            'merror': [{
                message: 'hello'
            }]
        });
        expect(_error[0][1][0].message).toBe('hello');

        valueManager.update('test', 'more');
        expect(_value[2][0]).toBe('more');
    });


});