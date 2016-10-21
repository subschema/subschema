"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {PropTypes, decorators, ValueManager, Form, Field, loader, loaderFactory, types, templates, injector} from 'Subschema';
import {into,change, blur, intoWithContext, byTag, byComponent,findNode} from 'subschema-test-support';

describe('components/Field', function () {
    this.timeout(50000);

    const validators = ['required', function (val) {
        if (val && val.length < 3) {
            return {message: `${val.length} is less than 3`}
        }
    }];

    it('should render errors and friends', function () {
        const valueManager = ValueManager();
        const context = {
            valueManager,
            injector,
            loader
        };
        const WField = injector.inject(Field);
        const field = {
            help: 'Hello',
            validators,
            type: 'Text',
            template: 'EditorTemplate'
        };
        const finst = intoWithContext(<WField path="name"
                                              field={field}/>, context, true, PropTypes.contextTypes);
        expect(finst).toExist();
        const type = byComponent(finst, types.Text);
        const templ = byComponent(finst, templates.EditorTemplate);
        const input = byTag(finst, 'input');
        expect(type).toExist();
        expect(templ).toExist();
        expect(input).toExist();
        expect(templ.props.help.content).toBe('Hello');
        expect(templ.props.title).toBe('Name');
        expect(input.getAttribute('type')).toBe('text');
        change(input, 'a');
        expect(templ.props.help.content).toBe('Hello');
        change(input, 'aa');
        expect(templ.props.help.content).toBe('Hello');
        blur(input);
        expect(templ.props.error).toBe('2 is less than 3');
        change(input, 'aaa');
        expect(templ.props.error).toNotExist();
        expect(templ.props.help.content).toBe('Hello');

    });
    it('should not render template only field', function () {
        const valueManager = ValueManager();
        const tloader = loaderFactory();
        tloader.addType('TestText', class extends Component {

            static template = false;

            render() {
                return <input {...this.props}/>
            }
        });
        tloader.addTemplate('EditorTemplate', templates.EditorTemplate);

        const context = {
            valueManager,
            injector,
            loader: tloader
        };

        const WField = injector.inject(Field);
        const field = {
            help: 'Hello',
            type: 'TestText'
        };
        const finst = intoWithContext(<WField path="name"
                                              field={field}/>, context, true, PropTypes.contextTypes);
        expect(finst).toExist();
        const input = byTag(finst, 'input');
        expect(input).toExist();

    });

    it('should render errors and friends with type custom typeTemplate', function () {
        const valueManager = ValueManager();
        const tloader = loaderFactory([loader]);

        const context = {
            valueManager,
            injector,
            loader: tloader
        };

        class JoeText extends Component {
            static template = {
                template: 'JoeTemplate'
            };

            render() {
                return <input {...this.props}/>
            }
        }
        class JoeTemplate extends Component {
            static propTypes = {
                error: PropTypes.error,
                title: PropTypes.title,
                name: PropTypes.string,
                help: PropTypes.node
            };

            render() {
                var {name, title, help, error, errorClassName, message, fieldClass,  children} = this.props;

                return (<div>
                    {title}
                    {children}
                    {error || help }
                </div>);
            }
        }
        tloader.addType('JoeText', JoeText);
        tloader.addTemplate('JoeTemplate', JoeTemplate);
        const WField = injector.inject(Field);
        const field = {
            help: 'Hello',
            type: 'JoeText',
            validators: validators
        };
        const finst = intoWithContext(<WField path="name" field={field}/>, context, true, PropTypes.contextTypes);
        expect(finst).toExist();
        const type = byComponent(finst, JoeText);
        const templ = byComponent(finst, JoeTemplate);
        const input = byTag(finst, 'input');
        expect(type).toExist();
        expect(templ).toExist();
        expect(input).toExist();
        expect(templ.props.help).toBe('Hello');
        expect(templ.props.title).toBe('Name');
        change(input, 'a');
        expect(templ.props.help).toBe('Hello');
        change(input, 'aa');
        expect(templ.props.help).toBe('Hello');
        blur(input);
        expect(templ.props.error).toBe('2 is less than 3');
        change(input, 'aaa');
        expect(templ.props.error).toNotExist();
        expect(templ.props.help).toBe('Hello');

    });
});
