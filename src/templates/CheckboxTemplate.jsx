"use strict"
import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class CheckboxTemplate extends Component {
    static propTypes = {
        label: PropTypes.node,
        checkboxClass: PropTypes.style
    };
    static defaultProps = {
        checkBoxClass: "CheckboxTemplate"
    };

    render() {
        const {children,checkBoxClass, label} = this.props;
        return (<div className={checkBoxClass}>
            <label>
                {children}
                {label}
            </label>
        </div>);
    }
}