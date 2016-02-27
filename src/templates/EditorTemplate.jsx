"use strict";
import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import Content from '../types/Content.jsx';

export default class EditorTemplate extends Component {
    static propTypes = {
        error: PropTypes.error,
        title: PropTypes.title,
        name: PropTypes.string,
        help: PropTypes.node,
        style: PropTypes.style,
        htmlFor: PropTypes.htmlFor
    };


    render() {
        let {name, htmlFor, title, help,labelClass, hasTitleClass,noTitleClass, errorClass, helpClass, error, hasErrorClass, errorClassName, message, fieldClass,  children} = this.props;
        if (hasErrorClass) {
            errorClassName = hasErrorClass;
        }
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