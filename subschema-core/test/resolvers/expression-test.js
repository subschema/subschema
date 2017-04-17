"use strict";
import React, {Component} from 'react';
import expect from 'expect';

import {resolvers, PropTypes, decorators, ValueManager} from 'Subschema';
import { intoWithContext, byComponent,findNode} from 'subschema-test-support';
import injectorFactory from 'subschema-injection/src/injectorFactory';
const injector = injectorFactory();

describe('resolvers/expression', function () {

    class ExpressionTest extends Component {
        static propTypes = {
            expr1: PropTypes.expression,
            expr: PropTypes.expression,
            value: PropTypes.value
        };

        render() {
            return <span>{this.props.expr} {this.props.expr1}</span>
        }
    }

    injector.resolver(PropTypes.expression, resolvers.expression);
    it('should evaluate expression', function () {
        const Injected = injector.inject(ExpressionTest, {path: PropTypes.path});
        const valueManager = ValueManager({'other': 'stuff', hello: {more: '', test: ''}});
        const inst = intoWithContext(<Injected path="hello"
                                               expr="hi {other}"
                                               expr1="{.more} {.test}."/>, {
            valueManager

        }, true);

        const et = byComponent(inst, ExpressionTest);

        expect(et).toExist();
        expect(et.props.expr).toBe('hi stuff');
        expect(et.props.expr1).toBe(' .');
        valueManager.update('hello.more', 'I am');
        expect(et.props.expr1).toBe('I am .');

        valueManager.update('hello.test', 'cool');
        expect(et.props.expr1).toBe('I am cool.');
        expect(et.props.expr).toBe('hi stuff');
        valueManager.update('other', 'huh');
        expect(et.props.expr).toBe('hi huh');
        expect(et.props.expr1).toBe('I am cool.');
    });

});