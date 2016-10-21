"use strict";
import React from 'react';
import { into, intoWithContext, select, TestUtils,expect, Simulate,byTypes, byType, notByType} from 'subschema-test-support';
import {ValueManager, PropTypes, Conditional as _Conditional, newSubschemaContext, types} from 'Subschema';
const {Select} = types;

describe('components/Conditional', function () {
    this.timeout(5000);
    let Conditional;
    let loader;
    let Subschema;
    let injector;
    let Form;
    before(function () {
        Subschema = newSubschemaContext();
        ({Form, injector, loader} = Subschema);

        Conditional = injector.inject(_Conditional);
        loader.addTemplate({
            Hello
        });
    });
    class Hello extends React.Component {
        render() {
            return <div>Hello</div>;
        }
    }
    var schema = {
        'menu': {
            type: 'Radio',
            options: ['this', 'that', 'other']
        },
        'otherMenu': {
            type: 'Radio',
            options: ['this', 'that', 'other']
        },
        'this': {
            type: 'Text',
            conditional: 'menuConditional'
        },
        'that': {
            type: 'Text',
            template: 'FloatingLabel',
            conditional: {
                operator: !/stuf(f)/,
                value: 'other',
                listen: 'otherMenu'
            }
        }


    };
    it('should render conditional with regex', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional template='Hello'
                                                animate={false} path='hot'
                                                operator={/stuff/}/>, {
            valueManager: vm,
            loader: loader,
            injector
        }, false, PropTypes.contextTypes);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', 'cold');
        notByType(cond, Hello);

    });
    it('should render conditional with negated regex', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional template='Hello' animate={false} path='hot'
                                                operator={'!/stuff/i'}/>, {
            valueManager: vm,
            injector,
            loader
        }, false, PropTypes.contextTypes);
        expect(cond).toExist();
        byType(cond, Hello);
        vm.update('hot', 'stuff');
        notByType(cond, Hello);
        vm.update('hot', 'ColDd');
        byType(cond, Hello);

    });

    it('should render conditional with str regex', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional template={Hello} animate={false} path='hot' operator='/stuff/i'
        />, {
            valueManager: vm,
            injector,
            loader
        }, false, PropTypes.contextTypes);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', 'ColDd');
        notByType(cond, Hello);

    });

    it('should render conditional with null', function () {
        var valueManager = ValueManager();
        var cond = intoWithContext(<Conditional template={'Hello'} animate={false} path='hot'
        />, {
            valueManager,
            injector,
            loader
        }, true, PropTypes.contextTypes);
        expect(cond).toExist();
        notByType(cond, Hello);
        valueManager.update('hot', 'stuff');
        byType(cond, Hello);
        valueManager.update('hot', null);
        notByType(cond, Hello);

    });
    it('should render children or not', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional animate={false} path='hot'
        ><Hello/></Conditional>, {
            valueManager: vm,
            injector,
            loader
        }, false, PropTypes.contextTypes);

        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', null);
        notByType(cond, Hello);

    });

    describe('ModelAndMake', function () {
        var schema = {
            "schema": {
                "make": {
                    "title": "Make",
                    "type": "Select",
                    "placeholder": "Select a make",
                    "options": [{"label": "AMC", "val": "amc"}, {"label": "Buick", "val": "buick"}]
                },
                "model": {
                    "title": "Model",
                    "type": "Select",
                    "placeholder": "Select a make first",
                    "conditional": {"listen": "make", "operator": "falsey"}
                },
                "amc": {
                    "title": "Model of AMC",
                    "conditional": {"listen": "make", "value": "amc", "operator": "===", path: "model"},
                    "type": "Select",
                    "placeholder": "Select a model of AMC",
                    "options": ["AMX", "Concord", "Eagle", "Gremlin", "Matador", "Pacer"]
                },
                "buick": {
                    "title": "Model of Buick",
                    "conditional": {"listen": "make", "value": "buick", "operator": "===", path: "model"},
                    "type": "Select",
                    "placeholder": "Select a model of Buick",
                    "options": ["LeMans", "Skylark"]
                }

            },
            "fieldsets": [{
                "legend": "Make And Model Linked Selects",
                "fields": ["make", "model", "amc", "buick"]
            }]
        };
        it('should render make and model', function () {
            var valueManager = ValueManager({});
            var form = into(<Form schema={schema} valueManager={valueManager}/>, true);
            var selects = byTypes(form, Select);

            expect(selects.length).toBe(2, 'Should have 2 selects');
            select(selects[0], 2);
            /*
             var selects = byTypes(form, Select);
             select(selects[1], 1);
             expect(selects[1].props.placeholder).toBe('Select a model of AMC', 'should update placeholder');


             expect(valueManager.path('model')).toBe('AMX', 'should update the model');*/


        })
    })
});

