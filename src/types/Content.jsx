"use strict";

import React, {Component, DOM} from 'react';
import map from 'lodash/collection/map';
import {isString,isObject, isArray, toArray} from '../tutils';
import defaults from 'lodash/object/defaults';
import PropTypes from '../PropTypes';
import DefaultWrapper from './ContentWrapper.jsx';

export default class Content extends Component {
    static isContainer = true;

    static contextTypes = {
        loader: PropTypes.loader
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
        injected: PropTypes.injectedClass


    };

    //Expose for react-native subschema.
    static defaultProps = {
        type: 'span',
        content: '',
        contentWrapper: DefaultWrapper
    };

    static Types = DOM || {};

    renderChildren(props, children) {
        if (children && props.children) {
            return children;
        }
    }

    renderChild(content, props, prefix, children) {
        if (content == null || content === false) {
            return null;
        }
        if (isString(content)) {
            var ContentWrapper = this.props.contentWrapper;
            return <ContentWrapper {...props} key={'content-'+prefix} content={content}/>
        }
        const Content = this.props.injected;

        if (isArray(content)) {
            //TODO - check if we need to flatten this.
            return  content.map((c, key)=> {
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
    }

    render() {
        let {type, content, children, field, context, ...props} = this.props;
        if (field && field.content) {
            content = field.content;
        }
        if (content == null || content === false) {
            return null;
        }
        /**
         * a field could be described like
         *
         * {
         *   type:'Content',
         *   content:'Hello {name}'
         * }
         * and content type would be Content so... there.
         */
        if (type === Content.displayName) {
            //The real type when type == 'Content' not a great solution and will break if someone renames content.
            // if they do they will need to change the display name;
            props.type = type = Content.defaultProps.type;
        }
        /**
         * This is the case
         * {
         *   type:'Content',
         *   content:{
         *     className:'stuff',
         *     type:'div',
         *     content:[{//array or object of content}]
         *   }
         * }
         *
         */
        if (content.content) {
            var {...rest} = content;
            delete rest.content;
            children = this.renderChild(content.content, rest, 'dom', children)
        } else

        /**
         * Case where content is a string.
         * {
         *   content:'hello world'.
         * }
         */
        if (isString(content)) {
            props.type = type;
            return this.renderChild(content, props, 'str-c');

            /**
             * Case where content is an array maybe mixed.
             *
             * {
             *   content:[{
             *      content:'What',
             *      className:'stuff'
             *   },
             *   'Hello',
             *   ['more', {content:'stuff'}],
             *   {
             *    children:true
             *   }
              *  ]
             * }
             *
             */
        } else if (isArray(content)) {
            props.type = type;
            children = this.renderChild(content, props, 'arr', children);
        } else if (content.content === false) {
            props = defaults(content, props);
            type = props.type;
        }

        if (Content.Types[type]) {
            return React.createElement(type, props, children);
        }

        let Ctype = this.context.loader.loadType(type);

        return <Ctype {...props} >
            {children}
        </Ctype>
    }
}
