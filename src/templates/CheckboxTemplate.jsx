"use strict"
import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class CheckboxTemplate extends Component {
    static propTypes = {
        label: PropTypes.node,
        style: PropTypes.style
    };
    static defaultProps = {
        style: "CheckboxTemplate"
    };

    render() {
        const {children,checkboxClass, label} = this.props;
        return (<div className={checkboxClass}>
            <label>
                {children}
                {label}
            </label>
        </div>);
    }
}