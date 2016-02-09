"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import { PropTypes, ValueManager, templates, types, loader, loaderFactory} from 'subschema';
import support, {intoWithContext, byComponent,findNode} from 'subschema-test-support/src/index.js';
import injector from '../../src/injector';

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
            const {Template, Type, ...rest} = this.props.field;

            if (Template) {
                return <Template {...rest}><Type {...rest}/></Template>
            }
            return <Type {...rest}/>
        }
    }
    it('should inject default type and template', function () {

        const Wrap = injector.inject(ResolverFieldTest);

        const valueManager = ValueManager();

        const inst = intoWithContext(<Wrap/>, {
            valueManager,
            loader,
            injector
        }, true, PropTypes.contextTypes)

        const test = byComponent(inst, ResolverFieldTest);
        const f = test.props.field;
        expect(f.Template.name).toBe('InjectedClass');
        expect(f.Type.name).toBe('InjectedClass');

    });
    it('should inject default type and overriden template', function () {


        class TestType extends Component {
            static template = {template: 'JoeTemplate', className:'what'};

            render() {
                return <span>testtype</span>
            }
        }
        const Wrap = injector.inject(ResolverFieldTest);

        const valueManager = ValueManager();
        const nloader = loaderFactory([loader]);
        nloader.addTemplate('JoeTemplate', JoeTemplate);
        nloader.addType('TestType', TestType);

        const inst = intoWithContext(<Wrap field={{type:'TestType'}}/>, {
            valueManager,
            loader:nloader,
            injector
        }, true, PropTypes.contextTypes)

        const test = byComponent(inst, ResolverFieldTest);
        const f = test.props.field;
        expect(f.Template.name).toBe('InjectedClass');
        expect(f.Type.name).toBe('InjectedClass');
        const tt = byComponent(inst, TestType);
        const jt = byComponent(inst, JoeTemplate);

    });
    it('should inject default type and template is false', function () {


        class TestType extends Component {
            static template = false;

            render() {
                return <span>testtype</span>
            }
        }
        const Wrap = injector.inject(ResolverFieldTest);

        const valueManager = ValueManager();
        const nloader = loaderFactory([loader]);
        nloader.addTemplate('JoeTemplate', JoeTemplate);
        nloader.addType('TestType', TestType);

        const inst = intoWithContext(<Wrap field={{type:'TestType'}}/>, {
            valueManager,
            loader:nloader,
            injector
        }, true, PropTypes.contextTypes)

        const test = byComponent(inst, ResolverFieldTest);
        const f = test.props.field;
        expect(f.Template).toNotExist();
        expect(f.Type.name).toBe('InjectedClass');
        const tt = byComponent(inst, TestType);


    });
});
