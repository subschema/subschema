import React from 'react';
import ReactDOM from 'react-dom';
import css from '../css';
import RestrictedMixin from './RestrictedMixin';
import field from '../decorators/field';
import PropTypes from '../PropTypes';
import {noop} from '../tutils';

@field(null, null, null, true)
export default class Restricted extends RestrictedMixin {
    static contextTypes = PropTypes.contextTypes;
    static defaultProps = {
        onValid: noop
    }

    componentWillReceiveProps(newProps) {
        if (this.props.value !== newProps.value) {
            this._value(newProps.value);
        }
    }

    handleSelectionRange = (caret)=> {
        var input = ReactDOM.findDOMNode(this.refs.input);
        if (!input)return;

        if (caret != null)
            input && input.setSelectionRange(caret, caret);
    }

    render() {
        var {onChange, onValueChange, onBlur, className,field,value, dataType, value, type, fieldAttrs, ...props} = this.props
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleValueChange} id={this.props.name}
                      className={css.forField(this)}
                      value={this.state.value}
            {...props} {...fieldAttrs} type={dataType || 'text'} onKeyDown={this.handleKeyDown}/>
    }
}