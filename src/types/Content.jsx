"use strict";

var React = require('../react');
var ContentWrapper = require('./ContentWrapper.jsx');
var DOM = React.DOM || {};
var map = require('lodash/collection/map');
var isObject = require('lodash/lang/isObject');
var tu = require('../tutils');
var defaults = require('lodash/object/defaults');
function renderChild(content, props, prefix) {
    if (!content) {
        return null;
    }
    if (tu.isString(content)) {
        return <ContentWrapper key={'content-'+prefix} {...props} content={content}/>
    }

    if (Array.isArray(content)) {

        return map(content, (c, key)=> {
            if (c.content) {
                return renderChild(c.content || c, defaults(c, props), prefix + '-ac-' + key);
            } else {
                return renderChild(c, props, prefix + '-a-' + key);
            }
        });
    }

    if (isObject(content)) {

        return map(content, (c, key)=> {
            if (c.content) {
                return renderChild(c.content || c, defaults({type: key}, c, props), prefix + '-mc-' + key);
            } else {
                return renderChild(c, defaults({type: key}, props), prefix + '-m-' + key);
            }
        });
    }

    return <Content key={'conent-ft-'+prefix}  {...props} content={content}/>
}


var Content = React.createClass({
    getDefaultProps(){
        return {
            type: 'span',
            content: ''
        }
    },
    render(){
        var {type, content, context, ...props} = this.props, Ctype;
        if (type === 'Content') {
            type = 'span';
        }
        if (tu.isString(content)) {
            props.type = type;
            return renderChild(content, props, 'c');
        }
        var children = renderChild(content, props, 'dom');

        if (React.DOM[type]) {
            if (children) {
                props.children = children;
            }
            return React.createElement(type, props);
        }
        if (this.props.loader) {
            Ctype = this.props.loader.loadType(type);
        }
        return <Ctype {...props}>
            {children}
        </Ctype>
    }
});
module.exports = Content;