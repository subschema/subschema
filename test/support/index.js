"use strict";
import React from 'react';
import { PropTypes, ValueManager, loader} from 'Subschema';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

var Simulate = TestUtils.Simulate;

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
function byName(root, name){
    var all = TestUtils.findAllInRenderedTree(root, function (inst) {
        if (!TestUtils.isDOMComponent(inst)){
            return false;
        }
        var inode = findNode(inst);
        return inode.name === name;
    });
    if (all.length !== 1) {
        throw new Error('Did not find exactly one match for name:' + name);
    }
    return all[0];
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
function byClass(node, className){
    return TestUtils.scryRenderedDOMComponentsWithClass(node, className);
}
function findNode(n) {
    return ReactDOM.findDOMNode(n);
}
function context(ctx){
    if (ctx == null){
        ctx = {
            valueManager:ValueManager(),
            loader:loader
        }
    }
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
    return byType(into(<Context>{child}</Context>, debug), child.type);
}


module.exports = {
    React,
    ReactDOM,
    TestUtils,
    Simulate,
    context,
    intoWithContext,
    prettyLog,
    findNode,
    into,
    expect,
    click,
    byName,
    byTags,
    byTag,
    byType,
    notByType,
    filterProp,
    byClass,
    byComponent,
    byComponents,
    change
}