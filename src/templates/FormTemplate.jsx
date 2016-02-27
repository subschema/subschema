"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
export default class FormTemplate extends Component {

    static propTypes = {
        style: PropTypes.style,
        onSubmit: PropTypes.event,
        accept: PropTypes.string,
        acceptCharset: PropTypes.string,
        action: PropTypes.string,
        autocapitalize: PropTypes.oneOf(['on', 'off', 'words', 'sentences', 'charecters', 'none']),
        autocomplete: PropTypes.oneOf(['on', 'off']),
        enctype: PropTypes.oneOf(['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']),
        method: PropTypes.oneOf(['get', 'post']),
        name: PropTypes.string,
        novalidate: PropTypes.bool,
        target: PropTypes.string,
        fieldAttrs: PropTypes.any
    };

    static defaultProps = {
        className: ''
    };

    render() {
        var {children, name, fieldAttrs, enctype,formClass, className, action, method, onSubmit, ...props} = this.props;
        return (<form name={name} action={action} enctype={enctype} method={method} onSubmit={onSubmit}
                      className={className || formClass} {...fieldAttrs}>
            {children}
        </form>);
    }
}