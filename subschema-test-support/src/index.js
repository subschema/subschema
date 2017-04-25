import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import ValueManager from 'subschema-valuemanager';
import loader from 'subschema-loader';
import injector from 'subschema-injection';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import expect from 'expect';

const Simulate = TestUtils.Simulate;

function prettyLog(result) {
    console.log(JSON.stringify(result, null, '\t'));
}

function cleanUp() {
    const nodes = document.getElementsByClassName('__test__inserted__');
    while(nodes[0]){
        nodes[0].parentNode.removeChild(nodes[0]);
    }
}
function into(node, debug) {
    const ele = document.createElement('div');
    ele.className = `__test__inserted__`;
    if (debug === true) {
        document.body.appendChild(ele);
    }
    return ReactDOM.render(node, ele);
}

function notByType(node, type, description) {
    var ret = byTypes(node, type);
    expect(ret[0]).toNotExist(description);
}
function expected(nodes, length) {
    if (length === void(0)) {
        return nodes;
    }
    if (nodes.length !== length) {
        throw new Error(`Found ${node.length} nodes expected ${length}`);
    }
    return nodes;
}
function byTypes(node, type, length) {
    return expected(TestUtils.scryRenderedComponentsWithType(node, type), length);
}
function byType(node, type) {
    return TestUtils.findRenderedComponentWithType(node, type);
}

function byTag(node, tag) {
    return TestUtils.findRenderedDOMComponentWithTag(node, tag);
}

function byTags(node, tag, length) {
    return expected(TestUtils.scryRenderedDOMComponentsWithTag(node, tag), length);
}
function onlyOne(node) {
    if (node.length != 1) {
        throw new Error(`Found ${node.length} nodes expected 1`)
    }
    return node[0];
}
function byName(root, name) {
    return onlyOne(TestUtils.findAllInRenderedTree(root, function (inst) {
        if (!TestUtils.isDOMComponent(inst)) {
            return false;
        }
        var inode = findNode(inst);
        return inode.name === name;
    }));
}


function filterProp(node, property, value) {
    node = Array.isArray(node) ? node : [node];
    return node.filter((n) => {
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
    return onlyOne(all);
}

function click(node) {
    Simulate.click(findNode(node));
    return node;
}

function change(node, value) {
    Simulate.change(findNode(node), {target: {value}});
    return node;
}
function check(node, checked, value) {
    Simulate.change(findNode(node), {target: {checked, value}});
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
    return onlyOne(TestUtils.scryRenderedComponentsWithType(asNode(node), comp));
}

function byComponents(node, comp, length) {
    return expected(TestUtils.scryRenderedComponentsWithType(asNode(node), comp), length);
}
function byClass(node, className) {
    return TestUtils.scryRenderedDOMComponentsWithClass(asNode(node), className);
}
function asNode(node) {
    if (Array.isArray(node)) {
        return onlyOne(node);
    }
    return node;
}
function findNode(n) {
    return ReactDOM.findDOMNode(asNode(n));
}
function defChildContext() {
    return {
        valueManager: ValueManager(),
        loader: loader,
        injector: injector
    };
}
function context(childContext = defChildContext, childContextTypes = {
    valueManager: PropTypes.valueManager,
    loader: PropTypes.loader,
    injector: PropTypes.injector
}) {

    const getChildContext = typeof childContext === 'function' ? childContext : function () {
        return childContext;
    };

    class Context extends Component {
        static childContextTypes = childContextTypes;

        getChildContext = getChildContext;

        render() {
            return this.props.children;
        }
    }
    return Context;
}
function intoWithContext(child, ctx, debug, contextTypes) {
    var Context = context(ctx, contextTypes);
    return byType(into(<Context>{child}</Context>, debug), child.type);
}


function select(composit, index) {
    var node = findNode(composit);
    var multiple = node.multiple;

    var options = byTags(composit, 'option')
    expect(options[index]).toExist(`${index} should exist`);
    if (!multiple) {
        options.forEach((option, idx) => {
            option.selected = (idx === index);
        })
    } else {
        options[index].selected = !options[index].selected;
    }

    Simulate.change(node, {
        target: {
            options,
            value: multiple ? options.map((o) => o.value) : options[index].value
        }
    });
    return node;
}
class StateWrapper extends Component {
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

export {
    cleanUp,
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
    focus,
    expected
}