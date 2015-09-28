"use strict";

var React = require('../react');
var DOM = React.DOM || {};
var escape = require('lodash/string/escape');
var loget = require('lodash/object/get');
var map = require('lodash/collection/map');
var defaults = require('lodash/object/defaults');
var isObject = require('lodash/lang/isObject');
var tu = require('../tutils');
function remove(v) {
    v && v.remove();
}
function escapeGet(obj, key) {
    return escape(loget(obj, key, ''));
}


var ContentWrapper = React.createClass({
    mixins: [require('../ValueManagerListenerMixin')],
    substitute(str) {
        var checks = {};
        var createKey = this.createKey;

        function substitute$inner(v, key) {
            key = createKey(key);
            checks[key] = true;
            return "'+(escapeGet(obj, '" + key + "'))+'";
        }

        str = str.replace(/'/g, "\\'");
        var fmt = new Function('escapeGet', 'obj', "obj = obj || {}; return \'" + (str.replace(/\{([^\{\}]*)\}/g, substitute$inner)) + "'").bind(null, escapeGet);
        map(checks, (val, key)=> {
            return this.registerHandler(key, (value)=> {
                var state = {};
                state[key] = value;
                this.setState(state);
            }, this, true);
        });

        return fmt;

    },
    getDefaultProps(){
        return {
            type: 'span',
            content: ''
        }
    },
    componentWillReceiveProps(props){
        if (props.content !== this.props.content) {
            this.rebuildValue(props.content);
        }
    },
    componentWillMount(){
        this.rebuildValue(this.props.content);
    },
    rebuildValue(content){
        this._componentListeners.forEach((v)=>v.remove());
        this._value = this.substitute(content);
    },
    render(){
        var {type, content, children, context, ...props} = this.props, Type

        if (React.DOM[type]) {
            props.dangerouslySetInnerHTML = {
                __html: this._value(this.state)
            };
            return React.createElement(type, props);
        } else if (this.props.loader) {
            Type = this.props.loader.loadType(type);
        }
        return <Type {...props}>
            <span key='content' dangerouslySetInnerHTML={{ __html: this._value(this.state)}}/>
            {children}
        </Type>

    }
});
module.exports = ContentWrapper;