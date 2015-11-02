"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Simulate = TestUtils.Simulate;
var expect = require('expect');
var PropTypes = require('../../src/PropTypes');

function prettyLog(result) {
    console.log(JSON.stringify(result, null, '\t'));
}
function into(node, debug) {
    if (debug === true) {
        debug = document.createElement('div');
        document.body.appendChild(debug)
        ReactDOM.render(node, debug);
    }
    return TestUtils.renderIntoDocument(node);
}

function notByType(node, type) {
    var ret = TestUtils.scryRenderedComponentsWithType(node, type);
    expect(ret[0]).toNotExist();
}
function byType(node, type) {
    return TestUtils.findRenderedComponentWithType(node, type);
}
function click(node) {
    Simulate.click(findNode(node));
}

function byTag(node, tag) {
    return TestUtils.findRenderedDOMComponentWithTag(node, tag);
}

function byTags(node, tag) {
    return TestUtils.scryRenderedDOMComponentsWithTag(node, tag);
}

function filterProp(node, property, value) {
    node = Array.isArray(node) ? node : [node];
    return node.filter((n)=> {
        var props = (n instanceof Element) ? n.attributes : n.props;
        if (property in props) {
            if (value === null) return true;

            return props[property] === value;
        }
        return false;
    })
}
function change(node, value) {
    Simulate.change(node, {target: {value}});
}
function byComponent(node, comp) {
    return TestUtils.scryRenderedComponentsWithType(node, comp)[0];
}

function byComponents(node, comp) {
    return TestUtils.scryRenderedComponentsWithType(node, comp);
}

function findNode(n) {
    return ReactDOM.findDOMNode(n);
}
function context(ctx){
    var childContextTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    };

    var Context = React.createClass({
        childContextTypes,
        getChildContext() {
            return ctx
        },
        render(){
            return this.props.children;
        }
    });
    return Context;
}
function intoWithContext(child, ctx, debug) {
    var Context = context(ctx)
    return into(<Context>{child}</Context>, debug);
}


module.exports = {
    context,
    intoWithContext,
    prettyLog,
    findNode,
    React,
    ReactDOM,
    TestUtils,
    Simulate,
    into,
    expect,
    click,
    byTags,
    byTag,
    byType,
    notByType,
    filterProp,
    byComponent,
    byComponents,
    change
}