"use strict";

import React, {Component} from 'react';
import styles from 'subschema-styles/FormTemplate-style';
import PropTypes from '../PropTypes';
export default class FormTemplate extends Component {
    static propTypes = {
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
    }

    static defaultProps = {
        className: styles.formClass,
    }

    render() {
        var {children, name, fieldAttrs, enctype, className, action, method, onSubmit, ...props} = this.props;
        return (<form name={name} action={action} enctype={enctype} method={method} onSubmit={onSubmit}
                      className={className} {...fieldAttrs}>
            {children}
        </form>);
    }
}