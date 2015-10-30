"use strict";

var React = require('../react');
var DefaultContentWrapper = require('./ContentWrapper.jsx');
var DOM = React.DOM || {};
var map = require('lodash/collection/map');
var isObject = require('lodash/lang/isObject');
var tu = require('../tutils');
var defaults = require('lodash/object/defaults');
var PropTypes =require('../PropTypes');
var Content = React.createClass({
    contextTypes: {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    },
    getDefaultProps(){
        return {
            type: 'span',
            content: ''
        }
    },
    renderChildren(props, children){
        if (!(children && props.children)) {
            return null;
        }
        if (!(children && props.children)) {
            return null;
        }
        if (props.children === true) {
            return children;
        }
        var toChildren;
        if (tu.isString(props.children) || tu.isArray(props.children)) {
            toChildren = tu.toArray(props.children);
        } else if (isObject(props.children)) {
            toChildren = Object.keys(props.children).filter((v)=> v === true);
        }
        if (!toChildren) {
            return null;
        }
        return toChildren.map((v)=> {
            return children[v];
        });

    },
    renderChild(content, props, prefix, children) {
        if (content == null || content === false) {
            return null;
        }
        if (tu.isString(content)) {
            var ContentWrapper = this.context.loader.loadType('ContentWrapper') || DefaultContentWrapper;
            return <ContentWrapper {...props} key={'content-'+prefix} content={content}/>
        }

        if (Array.isArray(content)) {
            //TODO - check if we need to flatten this.
            return map(content, (c, key)=> {
                //prevent children from being wrapped.
                if (c.children === true) {
                    return children;
                }
                if (c.content) {
                    if (typeof c.content !== 'string') {
                        return <Content {...c} key={'content-'+prefix+'-'+key}>
                            {this.renderChildren(c, children)}
                        </Content>
                    } else {
                        return this.renderChild(c.content, props, prefix + '-s-' + key, children);
                    }
                }
                return this.renderChild(c, {}, prefix + '-a-' + key, children);

            });
        }


        if (content.content) {
            return <Content {...content.content} key={'content-content'}>
                {this.renderChildren(content.content, children)}
            </Content>
        }

        return <Content {...props} key={'content-ft-'+prefix} content={content}>
            {this.renderChildren(content, children)}
        </Content>
    },

    render()
    {
        var {type, content, children, field, context, ...props} = this.props, Ctype;
        if (field && field.content) {
            content = field.content;
        }
        if (content == null || content === false) {
            return null;
        }
        if (type === 'Content') {
            type = 'span';
            props.type = type;
        }

        if (content.content) {
            var {...rest} = content;
            delete rest.content;
            children = this.renderChild(content.content, rest, 'dom', children)
        } else if (tu.isString(content)) {
            props.type = type;
            return this.renderChild(content, props, 'str-c');
        } else if (tu.isArray(content)) {
            props.type = type;
            children = this.renderChild(content, props, 'arr', children);
        } else if (content.content === false) {
            props = defaults(content, props);
            type = props.type;
        }

        if (React.DOM[type]) {
            return React.createElement(type, props, children);
        }

        Ctype = this.context.loader.loadType(type);

        return <Ctype {...props} >
            {children}
        </Ctype>
    }
});
module.exports = Content;