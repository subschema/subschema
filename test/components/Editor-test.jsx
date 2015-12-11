"use strict";
import {React, intoWithContext, findNode, TestUtils,expect, change, focus,blur, Simulate,byTag, byType, notByType} from '../support';
import {loader, loaderFactory, PropTypes, Editor, ValueManager, types, templates} from 'Subschema';
var {Text} = types;

describe('Editor', function () {
    this.timeout(50000);
    it('should inject things', function () {
        var valueManager = new ValueManager();
        var editor = intoWithContext(<Editor field={{type:'Text', name:'myname'}} path="test"/>, {
            valueManager,
            loader
        });
        expect(editor).toExist();
        var text = byType(editor, Text);
        expect(text).toExist();

        var {onChange,className, onBlur, name, id} = text.props;

        expect(onChange).toExist('onChange should exist');
        expect(onBlur).toExist('onBlur should exist');

        expect(typeof onBlur).toBe('function', 'onBlur should be a function');
        expect(typeof onChange).toBe('function', 'onChange should be a function');

        expect(className).toBe('form-control', 'className')

        expect(id).toBe('test', 'id');

        expect(name).toBe('myname', 'name');

        change(text, 'hello');
        expect(valueManager.path('test')).toBe('hello', 'valueManager should update');


    });

    it('should inject fieldClass', function () {
        var valueManager = new ValueManager();
        var editor = intoWithContext(<Editor field={{type:'Text', name:'myname', className:'me'}} path="test"/>, {
            valueManager,
            loader
        });
        expect(editor).toExist();
        var text = byType(editor, Text);
        expect(text).toExist();

        var {onChange,className, onBlur, name, id} = text.props;

        expect(onChange).toExist('onChange should exist');
        expect(onBlur).toExist('onBlur should exist');

        expect(typeof onBlur).toBe('function', 'onBlur should be a function');
        expect(typeof onChange).toBe('function', 'onChange should be a function');

        expect(className).toBe('me', 'className')

        expect(id).toBe('test', 'id');

        expect(name).toBe('myname', 'name');

        change(text, 'hello');
        expect(valueManager.path('test')).toBe('hello', 'valueManager should update');


    });

    it('should inject things with a custom eventValue with custom propTypes', function () {
        var count = 0;
        var customLoader = loaderFactory([loader]);
        class TestType extends Text {
            /**
             * PropTypes change injection.
             * @type {{cool: *}}
             */
            static propTypes = {
                cool: React.PropTypes.bool
            }

            /**
             * Input class can be overriden
             * @type {string}
             */
            static inputClassName = 'super-cool';


        }
        loader.addType('TestType', TestType);
        var valueManager = new ValueManager({test: 'good'});
        var editor = intoWithContext(<Editor
            field={{type:'TestType', validators:['required'], dataType:'hidden', name:'myname', cool:true, notCool:true}}
            path="test"/>, {
            valueManager,
            loader: customLoader
        });
        expect(editor).toExist();
        var text = byType(editor, TestType);
        expect(text).toExist();

        var {onChange,className, onBlur, name, value, dataType, type, cool, notCool, id} = text.props;
        expect(value).toBe('good', 'Should have the default value');
        expect(onChange).toExist('onChange should exist');
        expect(onBlur).toExist('onBlur should exist');

        expect(typeof onBlur).toBe('function', 'onBlur should be a function');
        expect(typeof onChange).toBe('function', 'onChange should be a function');

        expect(className).toBe('super-cool', 'className should be')
        expect(dataType).toNotExist('dataType should not make it through');
        expect(type).toBe('hidden', 'dataType should be converted to type')
        expect(id).toBe('test', 'id');
        expect(name).toBe('myname', 'name attribute');
        expect(cool).toBe(true, 'Sure defined custom props are handled')
        expect(notCool).toNotExist('Undefined custom props are undefined');

        focus(text);
        change(text, '');
        blur(text);
        var errors = valueManager.getErrors();
        expect(errors.test).toExist('Errors should exist');
        change(text, 'hello');

        errors = valueManager.getErrors();
        expect(errors.test).toNotExist('Errors should not exist (is valid now)');

        expect(valueManager.path('test')).toBe('hello', 'valueManager should update');

    });

    it('should update expressions', function () {
        class ExpressionTest extends React.Component {
            static propTypes = {
                stuff: PropTypes.expression,
                other: PropTypes.expression,
                when: PropTypes.expression
            }
            static defaultProps = {
                other: '{..test}-abc',
                when: '{..cando}-do'
            }

            render() {
                return <div>{this.props.stuff}{this.props.other}</div>
            }
        }
        var valueManager = ValueManager({cando:'do'});
        var customLoader = loaderFactory([loader]);
        customLoader.addType('ExpressionTest', ExpressionTest);
        var editor = intoWithContext(<Editor
            field={{type:'ExpressionTest', validators:['required'], stuff:'{..test}-dba'}}
            path="test"/>, {
            valueManager,
            loader: customLoader
        });

        var et = byType(editor, ExpressionTest);

        expect(et.props.other).toEqual('-abc');
        expect(et.props.stuff).toEqual('-dba');

        valueManager.update('test', 'super');
        expect(et.props.other).toEqual('super-abc');
        expect(et.props.stuff).toEqual('super-dba');

        expect(et.props.when).toEqual('do-do');
    });

    it('should update value expressions', function () {
        class ExpressionTest extends React.Component {
            static propTypes = {
                stuff: PropTypes.listener,
                other: PropTypes.listener,
                when: PropTypes.listener
            }
            static defaultProps = {
                other: 'test',
                when: '..cando'
            }

            render() {
                return <div>{this.props.stuff}{this.props.other}</div>
            }
        }
        var cando = ['do'];
        var valueManager = ValueManager({cando});
        var customLoader = loaderFactory([loader]);
        customLoader.addType('ExpressionTest', ExpressionTest);
        var editor = intoWithContext(<Editor
            field={{type:'ExpressionTest', validators:['required'], stuff:'.'}}
            path="test"/>, {
            valueManager,
            loader: customLoader
        });

        var et = byType(editor, ExpressionTest);

        expect(et.props.other).toNotExist();
        expect(et.props.stuff).toNotExist();

        valueManager.update('test', 'super');
        expect(et.props.other).toEqual('super');
        expect(et.props.stuff).toEqual('super');

        expect(et.props.when[0]).toEqual(cando[0]);
    });
});
