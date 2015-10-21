"use strict";

var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Simulate = React.addons.TestUtils.Simulate;
var ValueManager = require('../src/ValueManager');
var each = require('lodash/collection/each');
var Conditional = require('../src/Conditional.jsx');
function notByType(node, type) {
    var ret = TestUtils.scryRenderedComponentsWithType(node, type);
    expect(ret[0]).toNotExist();
}
function byType(node, type) {
    return TestUtils.findRenderedComponentWithType(node, type);
}
describe('Conditional', function () {
    this.timeout(30000);

    function into(node, debug) {
        return debug ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
    }

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
        var cond = into(<Conditional template={Hello} animate={false} path='hot' operator={/stuff/}
                                     valueManager={vm}/>, false);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', 'cold');
        notByType(cond, Hello);

    });
    it('should render conditional with negated regex', function () {
        var vm = ValueManager();
        var cond = into(<Conditional template={Hello} animate={false} path='hot' operator={'!/stuff/i'}
                                     valueManager={vm}/>, false);
        expect(cond).toExist();
        byType(cond, Hello);
        vm.update('hot', 'stuff');
        notByType(cond, Hello);
        vm.update('hot', 'ColDd');
        byType(cond, Hello);

    })
    it('should render conditional with str regex', function () {
        var vm = ValueManager();
        var cond = into(<Conditional template={Hello} animate={false} path='hot' operator={'/stuff/i'}
                                     valueManager={vm}/>, false);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', 'ColDd');
        notByType(cond, Hello);

    })
    it('should render conditional with null', function () {
        var vm = ValueManager();
        var cond = into(<Conditional template={Hello} animate={false} path='hot'
                                     valueManager={vm}/>, false);
        expect(cond).toExist();
        notByType(cond, Hello);
        vm.update('hot', 'stuff');
        byType(cond, Hello);
        vm.update('hot', null);
        notByType(cond, Hello);

    })
    it('should render children or not', function () {
        var vm = ValueManager();
        var cond = into(<Conditional animate={false} path='hot'
                                     valueManager={vm}><Hello/></Conditional>, false);

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
            '<=': [0, -1]

        }, function (v, k) {
            it('should "' + k + '" work', function () {
                var valueManager = ValueManager({
                    hot: 0
                });

                var cond = into(<Conditional template={Hello} animate={false} value={0} operator={k} path='hot'
                                             valueManager={valueManager}/>, false);
                each(v, function (nv, i) {
                    valueManager.update('hot', nv);
                    ((i + 1) % 2 ? byType : notByType)(cond, Hello);
                    valueManager.update('hot', 0);
                });
            })
        });

    });
});

