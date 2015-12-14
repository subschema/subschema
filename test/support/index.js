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

function notByType(node, type, description) {
    var ret = byTypes(node, type);
    expect(ret[0]).toNotExist(description);
}
function byTypes(node, type) {
    return TestUtils.scryRenderedComponentsWithType(node, type);
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
function byName(root, name) {
    var all = TestUtils.findAllInRenderedTree(root, function (inst) {
        if (!TestUtils.isDOMComponent(inst)) {
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
function byId(node, id) {
    var all = TestUtils.findAllInRenderedTree(node, function (inst) {
        if (!TestUtils.isDOMComponent(inst)) {
            return false;
        }
        var inode = findNode(inst);
        return inode.id === id;
    });
    if (all.length !== 1) {
        throw new Error('Did not find exactly one match for name:' + name);
    }
    return all[0];
}

function change(node, value) {
    Simulate.change(findNode(node), {target: {value}});
    return node;
}
function check(node, checked) {
    Simulate.change(findNode(node), {target: {checked}});
    return node;
}
function blur(node) {
    Simulate.blur(findNode(node));
    return node;
}

function focus(node) {
    Simulate.focus(findNode(node));
    return node;
}

function byComponent(node, comp) {
    return TestUtils.scryRenderedComponentsWithType(asNode(node), comp)[0];
}

function byComponents(node, comp) {
    return TestUtils.scryRenderedComponentsWithType(asNode(node), comp);
}
function byClass(node, className) {
    return TestUtils.scryRenderedDOMComponentsWithClass(asNode(node), className);
}
function asNode(node) {
    if (Array.isArray(node) && node.length === 1) {
        node = node[0];
    }
    return node;
}
function findNode(n) {
    return ReactDOM.findDOMNode(asNode(n));
}
function context(ctx) {
    if (ctx == null) {
        ctx = {
            valueManager: ValueManager(),
            loader: loader
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


function select(composit, index) {
    var node = findNode(composit);
    var multiple = node.multiple;

    var options = byTags(composit, 'option')
    expect(options[index]).toExist(`${index} should exist`);
    if (!multiple) {
        options.forEach((option, idx)=> {
            option.selected = (idx === index);
        })
    } else {
        options[index].selected = !options[index].selected;
    }

    Simulate.change(node, {
        target: {
            options,
            value: multiple ? options.map((o)=>o.value) : options[index].value
        }
    });
    return node;
}
class StateWrapper extends React.Component {
    render() {
        return React.cloneElement(this.props.children, this.state);
    }
}

function intoWithState(child, state, debug) {
    var s = into(<StateWrapper>{child}</StateWrapper>, debug);
    if (state != null) s.setState(state);
    var schild = byType(s, child.type);
    return {
        state: s,
        child: schild
    }
}

module.exports = {
    React,
    ReactDOM,
    TestUtils,
    Simulate,
    intoWithState,
    into,
    context,
    intoWithContext,
    prettyLog,
    findNode,
    expect,
    byId,
    byName,
    byTags,
    byTag,
    byType,
    byTypes,
    notByType,
    filterProp,
    byClass,
    byComponent,
    byComponents,
    //trigger events
    select,
    click,
    change,
    check,
    blur,
    focus
}