"use strict";
import {React, into, intoWithContext, TestUtils,expect, Simulate, byType, notByType} from './support';
import each from 'lodash/collection/each';
import {ValueManager, Conditional, loader} from 'subschema';

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
});

