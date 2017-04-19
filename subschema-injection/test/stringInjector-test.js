"use strict";
import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import expect from 'expect';

import stringInjector from '../lib/stringInjector';
import injectorFactory from '../lib/injectorFactory';

describe('stringInjector', function () {
    const fakeResolver = (clz) => {
        class NewClass extends clz {

        }
        return NewClass;
    };
    const resolvers = {
        value: fakeResolver,
        valueEvent: fakeResolver
    };
    const inj = injectorFactory(new Map([[PropTypes.valueEvent, resolvers.valueEvent], [PropTypes.valueManager, fakeResolver]]));

    const injector = stringInjector(inj, PropTypes);

    it('should resolve injectedProps that are strings', function () {
        const entries = Object.entries(resolvers).map(([k, v]) => [PropTypes[k], v]);
        const si = stringInjector(injectorFactory(entries), PropTypes);
        expect(si.resolveProp('value')).toBe(resolvers.value);
        //maintain existing
        expect(si.resolveProp(PropTypes.value)).toBe(resolvers.value);
    });
    it('should resolve components with string injectedPropTypes', function () {

        class TestComponent extends Component {
            static injectedPropTypes = {
                value: "valueEvent"
            };

        }
        const Injected = injector.inject(TestComponent);
        expect(Injected).toExist();
        expect(Injected).toNotBe(TestComponent);

    });
    it('should resolve components with string injectedPropTypes and injectedProps', function () {

        class TestComponent extends Component {
            static injectedPropTypes = {
                value: "valueEvent"
            };

            static injectedProps = {
                value: "."
            };
        }
        const Injected = injector.inject(TestComponent);
        expect(Injected).toExist();
        expect(Injected).toNotBe(TestComponent);
        expect(Injected.defaultProps.value).toBe('.');

    });
    it('should resolve components with string injectedPropTypes and injectedProps and propTypes', function () {

        class TestComponent extends Component {
            static injectedPropTypes = {
                value: "valueEvent"
            };
            static propTypes = {
                other: PropTypes.valueEvent
            };
            static injectedProps = {
                value: ".",
                other: 'otherness'
            };
        }
        const Injected = injector.inject(TestComponent);
        expect(Injected).toExist();
        expect(Injected).toNotBe(TestComponent);
        expect(Injected.defaultProps.value).toBe('.');
        expect(Injected.defaultProps.other).toBe('otherness');

    });
    it('should resolve components with string injectedPropTypes and injectedProps and propTypes and defaultProps', function () {

        class TestComponent extends Component {
            static injectedPropTypes = {
                value: "valueEvent"
            };
            static propTypes = {
                other: PropTypes.valueEvent
            };
            static injectedProps = {
                value: "."
            };
            static defaultProps = {
                value: 'not that',
                other: 'otherness'
            };
        }
        const Injected = injector.inject(TestComponent);
        expect(Injected).toExist();
        expect(Injected).toNotBe(TestComponent);
        expect(Injected.defaultProps.value).toBe('.');
        expect(Injected.defaultProps.other).toBe('otherness');

    });

    class ExternalComponent extends Component {
        //normal propTypes
        static propTypes = {
            onChange: PropTypes.func
        };
        //normal defaultProps
        static defaultProps = {};
        //Injected PropTypes will resolve against the valueEvent resolver
        static injectedPropTypes = {
            onChange: "valueEvent"
        };

        //Injected Props Value.
        static injectedProps = {
            onChange: "."
        };

    }
});
