"use strict";
import React, {Component} from 'react';
import style from 'subschema-styles/EditorTemplate-style';
import {forEditor} from '../css';
import PropTypes from '../PropTypes';
import Content from '../types/Content.jsx';

export default class EditorTemplate extends Component {
    static propTypes = {
        error: PropTypes.error,
        title: PropTypes.title,
        name: PropTypes.string,
        help: PropTypes.node,
        htmlFor: PropTypes.htmlFor
    };


    static defaultProps = Object.keys(style).reduce(function (obj, key) {
        obj[key + 'Class'] = style[key];
        return obj;
    }, {fieldClass: style.group,   errorClassName: style.hasError});

    render() {
        var {name, htmlFor, title, help,labelClass, hasTitleClass,noTitleClass, errorClass, helpClass, error, errorClassName, message, fieldClass,  children} = this.props;
        if (!title) {
            title = ''
        }
        return (<div
            className={fieldClass+" " + (error != null ? errorClassName || '' : '')}>
            <Content content={title} type="label" className={labelClass} htmlFor={htmlFor}/>

            <div className={title ? hasTitleClass : noTitleClass}>
                {children}
                {help === false ? null : <Content content={error ? error : help || ''} key='error-block' type='p'
                                                  className={error ? errorClass : helpClass}/>}
            </div>
        </div>);
    }
};