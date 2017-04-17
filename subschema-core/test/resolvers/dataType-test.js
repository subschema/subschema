"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {resolvers, PropTypes, decorators, ValueManager} from 'Subschema';
import support, {intoWithContext, byComponent,findNode, change} from 'subschema-test-support';
import injectorFactory from 'subschema-injection/src/injectorFactory';
const injector = injectorFactory();

describe('resolvers/dataType', function () {
    this.timeout(50000);
    const propTypes = {
        dataType: PropTypes.dataType
    };
    const defaultProps = {
        dataType: 'text'
    };


    injector.resolver(PropTypes.dataType, resolvers.dataType);

    it('should set type and not have dataType', function () {
        class TargetTest extends Component {
            render() {
                return <span>{this.props.type}</span>
            }
        }
        const Injected = injector.inject(TargetTest, {
            someType: PropTypes.dataType
        }, defaultProps);
        const inst = intoWithContext(<Injected someType="text"/>, {}, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        expect(et.props.type).toBe('text');
        expect(et.props.someType).toNotExist('dataType should not be passed');

    });
    it('should set dataType', function () {
        class TargetTest extends Component {
            render() {
                return <span>{this.props.type}</span>
            }
        }
        const Injected = injector.inject(TargetTest, propTypes, defaultProps);
        const inst = intoWithContext(<Injected />, {}, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        expect(et.props.type).toBe('text');

    });
    it('should set dataType by defaultProps', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;
            static defaultProps = defaultProps;

            render() {
                return <span>{this.props.type}</span>
            }
        }
        const Injected = injector.inject(TargetTest);
        const inst = intoWithContext(<Injected />, {}, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        expect(et.props.type).toBe('text');

    });

    it('should set dataType by defaultProps overrider by component', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;
            static defaultProps = defaultProps;

            render() {
                return <span>{this.props.type}</span>
            }
        }
        const Injected = injector.inject(TargetTest);
        const inst = intoWithContext(<Injected dataType="stuff"/>, {}, true);

        const et = byComponent(inst, TargetTest);
        expect(et.props.type).toBe('stuff');

    });

    it('should set dataType by defaultProps overrider by component with overrides', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;
            static defaultProps = defaultProps;

            render() {
                return <span>{this.props.type}</span>
            }
        }
        const Injected = injector.inject(TargetTest, propTypes, {dataType: 'other'});
        const inst = intoWithContext(<Injected dataType="stuff"/>, {}, true);

        const et = byComponent(inst, TargetTest);
        expect(et.props.type).toBe('stuff');

    });
    it('should set dataType by defaultProps overrider by component with overrides with defaults and configs', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;

            render() {
                return <span>{this.props.type}</span>
            }
        }
        const Injected = injector.inject(TargetTest, propTypes, {dataType: 'other'});
        const inst = intoWithContext(<Injected/>, {}, true);

        const et = byComponent(inst, TargetTest);
        expect(et.props.type).toBe('other');

    });
});