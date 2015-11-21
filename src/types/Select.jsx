"use strict";

import React, {Component} from 'react';
import Constants from '../Constants';
import util from '../tutils';
import {forField} from '../css';
import field from '../decorators/field';

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

@field
export default class Select extends Component {
    handleSelect(e) {
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
            this.triggerChange(values);
            return
        } else if (this.props.placeholder) {
            if (e.target.value === this.props.placeholder) {
                this.triggerChange(null);
                return;
            }
        }
        this.handleChange(e);
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
        var {field, onChange, fieldAttrs, onBlur, type, value, multiple, placeholder,  ...props} = this.props;
        var value = this.state.value;
        if (multiple && !Array.isArray(value)) {
            value = value ? [value] : value;
        }
        return <select className={forField(this)}
                       multiple={multiple}
                       ref="input"
                       value={value}
                       onBlur={this.handleValidate} onChange={this.handleSelect}
            {...props}
            {...fieldAttrs}
        >
            {this.renderOptions(value)}
        </select>
    }

}
