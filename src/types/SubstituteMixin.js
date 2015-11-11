"use strict";
var React = require('../React');
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

var SubstituteMixin = {
    mixins: [require('../ValueManagerListenerMixin')],

    substitute(str) {
        if (str == null){
            str = '';
        }
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
            });
        });

        return fmt;

    },
    rebuildValue(content){
        this._unlisten();
        this._value = this.substitute(content);
    },
    currentContent(){
        return this._value(this.state);
    }
};

module.exports = SubstituteMixin;