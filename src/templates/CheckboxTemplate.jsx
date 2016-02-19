"use strict"
import React, {Component, PropTypes} from 'react';
import Content from '../types/Content.jsx';
import style  from 'subschema-styles/CheckboxTemplate-style';


export default class CheckboxTemplate extends Component {
    static propTypes = {
        label: PropTypes.node
    };

    render() {
        const {children, label} = this.props;
        return (<div className={style.checkbox}>
            <label>
                {children}
                {label}
            </label>
        </div>);
    }
}