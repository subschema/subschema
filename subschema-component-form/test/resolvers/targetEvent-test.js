import expect from 'expect';
import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import ValueManager from 'subschema-valuemanager';
import {
    byComponent, change, findNode, intoWithContext
} from 'subschema-test-support';
import injectorFactory from 'subschema-injection/lib/injectorFactory';
import resolvers from 'subschema-core/lib/resolvers';

const injector = injectorFactory();
injector.resolver(PropTypes.targetEvent, resolvers.targetEvent);
injector.resolver(PropTypes.value, resolvers.value);
injector.resolver(PropTypes.dataType, resolvers.dataType);

describe('resolvers/targetEvent', function () {
    this.timeout(10000);
    const propTypes = {
        onChange: PropTypes.targetEvent,
        value   : PropTypes.value,
        dataType: PropTypes.dataType,
        path    : PropTypes.path
    };

    const defaultProps = {
        value   : '.',
        dataType: 'text'
    };

    class TargetTest extends Component {

        render() {
            const { path, ...props } = this.props;
            return <input {...props}/>
        }
    }
    class Target2Test extends Component {
        static defaultProps = {
            onChange(){

            }
        };
        static propTypes    = {
            onChange: PropTypes.targetEvent
        };

        render() {
            const { path, ...props } = this.props;
            return <input {...props}/>
        }
    }


    it('should follow change lifecyle', function () {
        const Injected     = injector.inject(TargetTest, propTypes,
            defaultProps);
        const valueManager = ValueManager({ 'other': 'stuff', more: 'd' });
        const inst         = intoWithContext(<Injected path="hello"/>, {
            valueManager

        }, true);

        const et   = byComponent(inst, TargetTest);
        const node = findNode(et);
        expect(et.props.type).toBe('text');
        change(et, 'world');
        expect(valueManager.path('hello')).toBe('world');
    });
    it('should allow for default functions to be ignored', function () {

        const Injected     = injector.inject(Target2Test, propTypes);
        const valueManager = ValueManager({ 'other': 'stuff', more: 'd' });
        const inst         = intoWithContext(<Injected path="hello"/>, {
            valueManager

        }, true);

        const et = byComponent(inst, Target2Test);
        expect(et.props.onChange).toNotBe(Target2Test.defaultProps.onChange);

    });
    it('should allow for default functions not to be ignored',
        function () {

            const Injected     = injector.inject(Target2Test, propTypes);
            const valueManager = ValueManager({ 'other': 'stuff', more: 'd' });
            const f            = () => {
            };
            const inst         = intoWithContext(<Injected path="hello"
                                                           onChange={f}/>, {
                valueManager

            }, true);

            const et = byComponent(inst, Target2Test);
            expect(et.props.onChange).toBe(f);

        });
});
