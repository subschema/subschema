import React from 'react';
import ReactDOM from 'react-dom';
import RestrictedMixin from './RestrictedMixin';
import PropTypes from '../PropTypes';
import {noop, returnFirst} from '../tutils';

export default class Restricted extends RestrictedMixin {
    static contextTypes = PropTypes.contextTypes;

    static defaultProps = {
        onValid: noop
    }
    static eventValue = returnFirst;

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
    handleChange = (e)=> {
        this.props.onChange(e.target.value);
    }

    render() {
        var {onValid, onChange, ...props} = this.props
        return <input ref="input" onKeyDown={this.handleKeyDown} onChange={this.handleChange} {...props}/>
    }
}