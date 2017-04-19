"use strict";
import React from 'react';
import {
    into,
    intoWithContext,
    select,
    TestUtils,
    expect,
    Simulate,
    byTypes,
    byType,
    notByType
} from 'subschema-test-support';
import ValueManager from 'subschema-valuemanager';
import PropTypes from 'subschema-prop-types';
import _Conditional from 'subschema-core/lib/Conditional';
import {types, templates} from 'subschema-component-form';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';

const {Select} = types;

class Hello extends React.Component {
    render() {
        return <div>Hello</div>;
    }
}
describe('components/Conditional', function () {
    this.timeout(5000);
    let Conditional;
    let loader;
    let injector;
    let Form;
    let context;
    let valueManager;
    beforeEach(function () {
        const _context = newSubschemaContext();
        Form = _context.Form;
        injector = _context.injector;
        loader = _context.loader;
        Conditional = injector.inject(_Conditional);
        context = {
            loader,
            injector,
            valueManager: _context.valueManager
        };
        valueManager = _context.valueManager;
        loader.addTemplate({
            Hello
        });
    });

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
        const vm = valueManager;
        const cond = intoWithContext(<Conditional template='Hello'
                                                  animate={false} path='hot'
                                                  operator={/stuff/}/>, context, false, PropTypes.contextTypes);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', 'cold');
        notByType(cond, Hello);

    });
    it('should render conditional with negated regex', function () {
        const vm = valueManager;
        const cond = intoWithContext(<Conditional template='Hello' animate={false} path='hot'
                                                  operator={'!/stuff/i'}/>, context, false, PropTypes.contextTypes);
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
        const cond = intoWithContext(<Conditional template={'Hello'} animate={false} path='hot'
        />, context, true, PropTypes.contextTypes);
        expect(cond).toExist();
        notByType(cond, Hello);
        valueManager.update('hot', 'stuff');
        byType(cond, Hello);
        valueManager.update('hot', null);
        notByType(cond, Hello);

    });
    it('should render children or not', function () {
        const vm = valueManager;
        const cond = intoWithContext(<Conditional animate={false} path='hot'
        ><Hello/></Conditional>, context, false, PropTypes.contextTypes);

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
            var form = into(<Form schema={schema} {...context}/>, true);
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

