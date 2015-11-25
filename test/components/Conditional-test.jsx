"use strict";
import {React, into, intoWithContext, select, TestUtils,expect, Simulate,byTypes, byType, notByType} from '../support';
import each from '../../node_modules/lodash/collection/each';
import {ValueManager, types, Form, Conditional, loader} from 'Subschema';
var {Select} = types;
describe('Conditional', function () {
    this.timeout(30000);

    var Hello = React.createClass({
        displayName: 'Test',
        render(){
            return <div>Hello</div>;
        }
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


    }
    it('should render conditional with regex', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional template={Hello} animate={false} path='hot'
                                                operator={/stuff/}/>, {valueManager: vm, loader: loader}, false);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', 'cold');
        notByType(cond, Hello);

    });
    it('should render conditional with negated regex', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional template={Hello} animate={false} path='hot'
                                                operator={'!/stuff/i'}/>, {valueManager: vm}, false);
        expect(cond).toExist();
        byType(cond, Hello);
        vm.update('hot', 'stuff');
        notByType(cond, Hello);
        vm.update('hot', 'ColDd');
        byType(cond, Hello);

    })
    it('should render conditional with str regex', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional template={Hello} animate={false} path='hot' operator={'/stuff/i'}
            />, {valueManager: vm}, false);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', 'ColDd');
        notByType(cond, Hello);

    })
    it('should render conditional with null', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional template={Hello} animate={false} path='hot'
            />, {valueManager: vm}, false);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', null);
        notByType(cond, Hello);

    })
    it('should render children or not', function () {
        var vm = ValueManager();
        var cond = intoWithContext(<Conditional animate={false} path='hot'
            ><Hello/></Conditional>, {valueManager: vm}, false);

        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', null);
        notByType(cond, Hello);

    });
    describe('operators', function () {
        /**
         * Test the operator.
         * if even position than false, odd position than true.
         */
        each({
            '==': [0, 1, 0, 2],
            '===': [0, 1],
            '!=': [1, ''],
            '!==': ['', 0],
            '>': [-1, 0],
            '>=': [0, 1],
            '<': [1, 0],
            '<=': [0, -1],
            'truthy': [1, 0, true, false, '1', ''],
            'falsey': [0, 1, false, true, '', '1']

        }, function (v, k) {
            it('should "' + k + '" work', function () {
                var valueManager = ValueManager({
                    hot: 0
                });

                var cond = intoWithContext(<Conditional template={Hello} animate={false} value={0} operator={k}
                                                        path='hot'
                    />, {valueManager}, false);
                each(v, function (nv, i) {
                    valueManager.update('hot', nv);
                    ((i + 1) % 2 ? byType : notByType)(cond, Hello);
                    valueManager.update('hot', 0);
                });
            })
        });

    });
    describe('ModelAndMake', function () {
        var schema = {
            "schema": {
                "make": {
                    "title": "Make",
                    "type": "Select",
                    "placeholder": "Select a make",
                    "options": [{"label": "AMC", "val": "amc"}]
                },
                "model": {
                    "title": "Model",
                    "type": "Select",
                    "placeholder": "Select a make first",
                    "conditional": {"listen": "make", "operator": "falsey"}
                },
                "amc": {
                    "title": "Model",
                    "conditional": {"listen": "make", "value": "amc", "operator": "===", "path": "model"},
                    "type": "Select",
                    "placeholder": "Select a model of AMC",
                    "options": ["AMX", "Concord", "Eagle", "Gremlin", "Matador", "Pacer"]
                },

            },
            "fieldsets": [{
                "legend": "Make And Model Linked Selects",
                "fields": ["make", "model", "amc"]
            }]
        };
        it('should render make and model', function () {
            var valueManager = ValueManager();
            var form = into(<Form schema={schema} valueManager={valueManager}/>)
            var selects = byTypes(form, Select);

            expect(selects.length).toBe(2, 'Should have 2 selects');
            select(selects[0], 1);
            expect(valueManager.path('make')).toBe('amc', 'should update the make');
            var selects = byTypes(form, Select);
            expect(selects[1].props.placeholder).toBe('Select a model of AMC', 'should update placeholder');
            select(selects[1], 1);
            expect(valueManager.path('model')).toBe('AMX', 'should update the model');


        })
    })
});

