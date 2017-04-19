"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import ValueManager from 'subschema-valuemanager';
import {intoWithContext, byComponent, findNode} from 'subschema-test-support';
import resolvers from 'subschema-core/lib/resolvers';
import {injectorFactory} from 'subschema-injection';

const injector = injectorFactory();

describe("resolvers/value", function () {
    this.timeout(50000);
    injector.resolver(PropTypes.value, resolvers.value);
    class ValueTestClass extends Component {
        static propTypes = {

            value: PropTypes.value
        };

        static defaultProps = {
            value: "."
        };

        render() {
            return <span>{this.props.value} {this.props.other}</span>
        }
    }


    it('should resolve value', function () {

        const Injected = injector.inject(ValueTestClass);
        const valueManager = ValueManager({'test': 'abc', more: 'd'});
        const inst = intoWithContext(<Injected value="test" other="more" stuff="what" options="a,b,c"
                                               expr="{more} {test}"/>, {
            valueManager
        }, true);

        expect(inst).toExist();
        const vtc = byComponent(inst, ValueTestClass);
        expect(vtc).toExist();
        expect(vtc.props.value).toBe('abc');
        valueManager.update('test', 'huh')
        expect(vtc.props.value).toBe('huh');
    });
});
