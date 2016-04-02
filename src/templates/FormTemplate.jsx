"use strict";

import React, {Component} from "react";
import PropTypes from "../PropTypes";
export default class FormTemplate extends Component {
    static displayName = 'FormTemplate';
    static propTypes = {
        style: PropTypes.style,
        onSubmit: PropTypes.submit,
        onReset: PropTypes.event,
        accept: PropTypes.string,
        acceptCharset: PropTypes.string,
        action: PropTypes.string,
        autocapitalize: PropTypes.oneOf(['on', 'off', 'words', 'sentences', 'charecters', 'none']),
        autocomplete: PropTypes.oneOf(['on', 'off']),
        encType: PropTypes.oneOf(['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']),
        method: PropTypes.oneOf(['get', 'post']),
        name: PropTypes.string,
        target: PropTypes.string,
        fieldAttrs: PropTypes.any,
        charSet: PropTypes.string,
        disabled: PropTypes.bool,
        noValidate: PropTypes.bool,
        novalidate: PropTypes.deprecated('Please use noValidate instead')

    };

    static defaultProps = {
        className: '',
        method: 'post'
    };

    render() {
        const {children, style, fieldAttrs, formClass, className, ...props} = this.props;
        return (<form {...props} className={className || formClass} {...fieldAttrs}>
            {children}
        </form>);
    }
}