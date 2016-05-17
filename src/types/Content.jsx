"use strict";

import React, {Component, DOM, Children, createElement} from "react";
import {isString, isObject, isArray} from "../tutils";
import warning from "../warning";
import PropTypes from "../PropTypes";
import DefaultWrapper from "./ContentWrapper";
const has = Function.call.bind(Object.prototype.hasOwnProperty);

/**
 * Content allows for arbitrary html to be added to a component,
 * if children is specified, than the children will be rendered.
 * set to true and it will render the children, set to an object,
 * and it will iterate through the children wrapping each child
 * with the described content. If no children:true or true is supplied
 * than the actual content will not be output.
 *
 *
 */
export default class Content extends Component {
    static isContainer = true;

    static contextTypes = {
        loader: PropTypes.loader,
        injector: PropTypes.injector
    };
    static propTypes = {
        content: PropTypes.any,
        contentWrapper: PropTypes.injectClass,
        value: PropTypes.any,
        onChange: PropTypes.any,
        title: PropTypes.any,
        className: PropTypes.cssClass,
        id: PropTypes.any,
        name: PropTypes.any,
        type: PropTypes.string,
        injected: PropTypes.injectedClass,
        dataType: PropTypes.dataType
    };

    //Expose for react-native subschema.
    static defaultProps = {
        type: 'span',
        content: '',
        contentWrapper: DefaultWrapper,
        injected: Content
    };

    static Types = DOM || {};

    renderChild(value, prefix, componentChildren) {
        //value true is a shortcut to {children:true}.  This means content:true would also return the children.
        let {Content, injected, contentWrapper, content, children, type=this.props.type, ...props} = value;

        if (content === true) {
            return componentChildren;
        }


        if (isString(content)) {
            var ContentWrapper = this.props.contentWrapper;
            return <ContentWrapper path={this.props.path} fieldAttrs={props} key={'content-'+prefix} type={type}
                                   content={content}/>
        }

        let newChildren;

        if (children) {
            if (children === true) {
                newChildren = componentChildren;
            } else {
                newChildren = Children.map(componentChildren, (child, i)=> {
                    warning(typeof children != 'string', "children property can not be a string");
                    return this.renderChild(children, `child-${prefix}-${i}`, child);
                });
            }
        } else if (isArray(content)) {
            newChildren = content.map((c, key)=> {
                let newC = this.asContentObject(c);
                return this.renderChild(newC, prefix + '-s-' + key, componentChildren);
            }, this);
        } else if (content === false) {
            newChildren = null;
        } else {
            newChildren = children;

        }

        if (this.constructor.Types[type]) {
            if (isArray(newChildren)) {
                return createElement(type, props, ...newChildren);
            }
            return createElement(type, props, newChildren);
        }

        const Ctype = this.context.injector.inject(this.context.loader.loadType(type));
        return <Ctype path={this.props.path} content={content} {...props} >
            {children}
        </Ctype>
    }

    asContentObject(content, props) {
        if (content == null) {
            return props;
        }
        if (has(content, 'content') || has(content, 'children')) {
            return {
                ...props,
                ...content
            }
        }
        if (typeof content === 'string' || Array.isArray(content) || content === true || content === false) {
            return {
                ...props,
                content
            }
        }
        //I made a mistake, I should not have allowed key, value types, but I did so, I'll try...
        return {
            ...props,
            content: Object.keys(content).map((type)=> {
                return this.asContentObject(content[type], {type});
            })
        };
    }

    render() {
        const {injected, contentWrapper, content, children, field, context, ...props} = this.props;
        if (content === false) {
            return null;
        }
        const normalContent = this.asContentObject(content, props);
        return this.renderChild(normalContent, 'obj', children);
    }
}
