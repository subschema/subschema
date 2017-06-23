import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';
import { byComponent, intoWithContext } from 'subschema-test-support';
import expect from 'expect';
const { className } = PropTypes;

describe('resolvers/className', function () {
    this.timeout(50000);

    class TestContainer extends Component {
        static propTypes = {
            className
        };

        render() {
            return <div {...this.props}/>
        }
    }
    class TestContainerDefault extends Component {
        static propTypes    = {
            className
        };
        static defaultProps = {
            className: 'whatever Some.more found missing'
        };

        render() {
            return <div {...this.props}/>
        }
    }
    it('should load default className', function () {
        const {context}            = newSubschemaContext();
        const { loader, injector } = context;
        loader.addStyle({
            TestContainer: {
                container: 'abc'
            }
        });
        const Injected = injector.inject(TestContainer);
        const inst     = byComponent(
            intoWithContext(<Injected />, context, true), TestContainer);
        expect(inst.props.className).toBe('abc');
    });
    it('should load default className with stuff', function () {
        const {context}            = newSubschemaContext();
        const { loader, injector } = context;
        loader.addStyle({
            Some                : {
                more: 'ghi'
            },
            Global              : {
                found: 'here'
            },
            TestContainerDefault: {
                whatever: 'the hell'
            }
        });
        const Injected = injector.inject(TestContainerDefault);
        const inst     = byComponent(
            intoWithContext(<Injected />, context, true),
            TestContainerDefault);
        expect(inst.props.className).toBe('the hell ghi here missing');
    })
});
