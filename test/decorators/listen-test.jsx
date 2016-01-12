"use strict";
import {React, into, intoWithContext, TestUtils,expect, Simulate, byType, notByType} from '../support';
import {ValueManager, Conditional, loader, decorators, PropTypes} from 'Subschema';
var listen = decorators.listen;

describe('decorators.listen', function () {
    this.timeout(50000);
    it('should listen to events', function () {
        var valueManager = ValueManager();
        var _value = [], _error = [];
        class Test extends React.Component {
            static stuff = {what: true};

            @listen('value', 'test', false)
            doSomething(value) {
                _value.push(value);
            }

            @listen('error', 'test', false)
            onError(value) {
                _error.push(value);
            }

            render() {
                return <div>hello</div>
            }
        }
        var comp = intoWithContext(<Test />, {valueManager});

        expect(valueManager.path('test')).toNotExist();
        valueManager.update('test', 1);

        expect(_value[0]).toBe(1);

        valueManager.setErrors({
            'test': [{
                message: 'hello'
            }]
        });
        expect(_error[0][0].message).toBe('hello');

        valueManager.update('test', 'more');
        expect(_value[1]).toBe('more');
    })
    it('should listen to events default', function () {
        var valueManager = ValueManager();
        var _value = [], _error = [];
        class Test extends React.Component {
            static stuff = {what: true};

            @listen
            test(value) {
                _value.push(value);
                this.setState({value});
            }

            @listen('error')
            onError(value) {
                _error.push(value);
            }

            render() {
                return <div>hello</div>
            }
        }
        var comp = intoWithContext(<Test path="test"/>, {valueManager});
        expect(valueManager.path('test')).toNotExist();
        valueManager.update('test', 1);
        expect(comp.state.value).toBe(1);
        expect(_value[1]).toBe(1);

        valueManager.setErrors({
            'test': [{
                message: 'hello'
            }]
        });
        expect(_error[1][0].message).toBe('hello');

        valueManager.update('test', 'more');
        expect(_value[2]).toBe('more');
    });
    it('should listen to events nested', function () {
        var valueManager = ValueManager();
        var _value = [], _error = [];
        class Test extends React.Component {
            static stuff = {what: true};

            @listen("value", ".what", false)
            doSomething(value) {
                _value.push(value);
            }

            @listen('error', ".what", false)
            onError(value) {
                _error.push(value);
            }

            render() {
                return <div>hello</div>
            }
        }
        var comp = intoWithContext(<Test path="test"/>, {valueManager});
        expect(valueManager.path('test')).toNotExist();
        valueManager.update('test.what', 1);

        expect(_value[0]).toBe(1);

        valueManager.setErrors({
            'test.what': [{
                message: 'hello'
            }]
        });
        expect(_error[0][0].message).toBe('hello');

        valueManager.update('test.what', 'more');
        expect(_value[1]).toBe('more');
    });
    it('should listen to events nested and call lifecycle', function (done) {
        var valueManager = ValueManager();
        var _value = [], _error = [], willMount, willReceiveProps, willUnmount;
        class Parent extends React.Component {
            static childContextTypes = {
                valueManager: PropTypes.valueManager,
            };

            getChildContext() {
                return {valueManager};
            }

            constructor(props) {
                super(props);
                this.state = {path: 'test'};
            }

            render() {
                return <Test ref="test" path={this.state.path}/>;
            }
        }
        class Test extends React.Component {

            componentWillMount() {
                willMount = true;
            }

            componentDidUpdate(props) {
                willReceiveProps = true;
            }

            componentWillUnmount() {
                willUnmount = true;
            }

            @listen("value")
            doSomething(value) {
                _value.push(value);
            }

            render() {
                return <div>hello {this.props.path}</div>
            }
        }
        var comp = into(<Parent/>, {valueManager}, false);
        comp.setState({path: 'what'}, function () {
            valueManager.update('what', 'huh');
            expect(_value[2]).toBe('huh');
            done();
        });
    })

});