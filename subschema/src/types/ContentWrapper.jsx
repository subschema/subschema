"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import {FREEZE_OBJ} from '../tutils';

export default class ContentWrapper extends Component {
    static defaultProps = {
        type: 'span',
        content: ''
    };

    static propTypes = {
        content: PropTypes.expression,
        type: PropTypes.domType,
        value: PropTypes.any,
        onChange: PropTypes.any,
        title: PropTypes.any,
        className: PropTypes.cssClass,
        id:PropTypes.any,
        name:PropTypes.any,
        fieldAttrs:PropTypes.any
    };

    render() {
        const {type, content, children, context, path, fieldAttrs=FREEZE_OBJ, ...props} = this.props;
        if (typeof type == 'string') {
            return React.createElement(type, {...fieldAttrs, ...props, dangerouslySetInnerHTML:{__html:content}});
        }
        const Type = type;
        return <Type {...props}/>;

    }
}