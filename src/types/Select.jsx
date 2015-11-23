"use strict";

import React, {Component} from 'react';
import Constants from '../Constants';
import util from '../tutils';
import {forField} from '../css';
import field from '../decorators/field';
import PropTypes from '../PropTypes';

function toLabelVal(v) {
    if (util.isString(v)) {
        return {
            label: v,
            val: v
        }
    }
    if (v == null) {
        return {
            label: 'No Value',
            val: null
        }
    }

    return v;
}

export default class Select extends Component {
    static eventValue(e) {
        return e;
    }

    static propTypes = {
        options: PropTypes.options,
        multiple: PropTypes.bool,

    }
    static defaultProps = {
        options: [],
        multiple: false
    }

    handleSelect = (e)=> {
        if (this.props.multiple) {
            var placeholder = this.props.placeholder;
            //normalize multiple field selection
            var values = [], options = e.target.options, i = 0, l = options.length, option;
            for (; i < l; i++) {
                var option = options[i];
                if (option.selected) {
                    if (option.label != placeholder)
                        values.push(option.value);
                }
            }
            this.props.onChange(values);
            return
        } else if (this.props.placeholder) {
            if (e.target.value === this.props.placeholder) {
                this.props.onChange(null);
                return;
            }
        }else{
            this.props.onChange(e.target.value);
        }
    }

    renderOptions(value) {
        var props = this.props, multiple = props.multiple, opts = props.options || [], hasValue = false, ret = opts.map(toLabelVal).map((o, i)=> {
            if (!hasValue && o.val + '' == '' + value) hasValue = true;
            return <option key={'s' + i} value={o.val}>{o.label}</option>
        });
        var placeholder = this.props.placeholder;
        if (placeholder) {

            ret.unshift(<option key={'null-' + opts.length}>
                {placeholder}</option>);
        }
        return ret;
    }

    render() {
        var {multiple, onChange,value, ...props} = this.props;
        if (multiple && !Array.isArray(value)) {
            value = value ? [value] : value;
        }
        return <select {...props} value={value} onChange={this.handleSelect}>
            {this.renderOptions(value)}
        </select>
    }

}
