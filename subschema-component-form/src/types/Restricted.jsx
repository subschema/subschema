import React from 'react';
import ReactDOM from 'react-dom';
import RestrictedMixin from './RestrictedMixin';
import PropTypes from 'subschema-prop-types';
import { noop } from 'subschema-utils';

export default class Restricted extends RestrictedMixin {
    static contextTypes = PropTypes.contextTypes;

    static defaultProps = {
        onValid: noop,
        value  : ''
    };
    static propTypes    = {
        onBlur     : PropTypes.blurValidate,
        onKeyDown  : PropTypes.event,
        onKeyUp    : PropTypes.event,
        onFocus    : PropTypes.event,
        onPaste    : PropTypes.event,
        value      : PropTypes.value,
        id         : PropTypes.id,
        name       : PropTypes.htmlFor,
        className  : PropTypes.typeClass,
        placeholder: PropTypes.string,
        onValid    : PropTypes.validEvent,
        onChange   : PropTypes.valueEvent,
        formatter  : PropTypes.string
    };

    static injectedProps = {
        value: '.'
    };

    handleSelectionRange = (caret) => {
        var input = this.refs && ReactDOM.findDOMNode(this.refs.input);
        if (!input) {
            return;
        }

        if (this.state.caret != null) {
            input && input.setSelectionRange(this.state.caret,
                this.state.caret);
        }
    };

    handleValueChange = (e) => {
        this._value(e.target.value, false);
    };

    render() {
        var { onValid, formatter, onChange, onKeyDown, fieldAttrs, value, ...props } = this.props
        return <input ref="input"  {...props} {...fieldAttrs}
                      value={this.state.value} onKeyDown={this.handleKeyDown}
                      onChange={this.handleValueChange}/>
    }
}
