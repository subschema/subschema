"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {newSubschemaContext, PropTypes, ValueManager, templates,  types} from 'Subschema';
import {intoWithContext, byComponent,findNode} from 'subschema-test-support';

const {field} = PropTypes;

describe('resolvers/field', function () {
    this.timeout(50000);
    class JoeTemplate extends Component {
        static propTypes = {
            error: PropTypes.error,
            title: PropTypes.title,
            name: PropTypes.string,
            help: PropTypes.node
        };

        render() {
            var {name, title, help, error, errorClassName, message, fieldClass,  children} = this.props;
            if (!title) {
                title = ''
            }
            return (<div>
                {name}
                {children}
                {help === false ? null : error }
            </div>);
        }
    }
    class ResolverFieldTest extends Component {
        static propTypes = {field};

        render() {
            const {template, Type, ...rest} = this.props.field;
            const {Template} = template || {};
            if (Template) {
                return <Template {...rest}><Type {...rest}/></Template>
            }
            return <Type {...rest}/>
        }
    }
    it('should inject default type and template', function () {
        const Subschema = newSubschemaContext();
        const {loader, injector} = Subschema;
        const Wrap = injector.inject(ResolverFieldTest);

        const valueManager = ValueManager();

        const inst = intoWithContext(<Wrap/>, {
            valueManager,
            loader,
            injector
        }, true, PropTypes.contextTypes)

        const test = byComponent(inst, ResolverFieldTest);
        const f = test.props.field;
        expect(f.template.Template.displayName).toMatch(/EditorTemplate\$Wrapper/);
        expect(f.Type.displayName).toMatch(/Text\$Wrapper/);

    });
    it('should inject default type and overriden template', function () {
        const Subschema = newSubschemaContext();
        const {loader, injector} = Subschema;

        class TestType extends Component {
            static template = {template: 'JoeTemplate', className: 'what'};

            render() {
                return <span>testtype</span>
            }
        }
        const Wrap = injector.inject(ResolverFieldTest);
        const valueManager = ValueManager();

        loader.addTemplate('JoeTemplate', JoeTemplate);
        loader.addType('TestType', TestType);

        const inst = intoWithContext(<Wrap field={{type:'TestType'}}/>, {
            valueManager,
            loader,
            injector
        }, true, PropTypes.contextTypes)

        const test = byComponent(inst, ResolverFieldTest);
        const f = test.props.field;
        expect(f.template.Template.displayName).toMatch(/\$Wrapper/);
        expect(f.Type.displayName).toMatch(/\$Wrapper/);
        const tt = byComponent(inst, TestType);
        const jt = byComponent(inst, JoeTemplate);

    });
    it('should inject default type and template is false', function () {

        const Subschema = newSubschemaContext();
        const {loader, injector} = Subschema;

        class TestType extends Component {
            static template = false;

            render() {
                return <span>testtype</span>
            }
        }
        const Wrap = injector.inject(ResolverFieldTest);

        const valueManager = ValueManager();
        loader.addTemplate('JoeTemplate', JoeTemplate);
        loader.addType('TestType', TestType);

        const inst = intoWithContext(<Wrap field={{type:'TestType'}}/>, {
            valueManager,
            loader,
            injector
        }, true, PropTypes.contextTypes);

        const test = byComponent(inst, ResolverFieldTest);
        const f = test.props.field;
        expect(f.Template).toNotExist();

        expect(f.Type.displayName).toMatch(/TestType\$Wrapper/);
        const tt = byComponent(inst, TestType);


    });
});
