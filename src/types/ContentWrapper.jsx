"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';

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
        name:PropTypes.any
    };

    render() {
        const {type, content, children, context,  ...props} = this.props;
        props.dangerouslySetInnerHTML = {__html: content};
        const Type = type;
        if (typeof type == 'string') {
            return React.createElement(type, props);
        }
        return <Type {...props}/>;

    }
}