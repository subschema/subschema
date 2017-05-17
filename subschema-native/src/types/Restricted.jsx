import React from 'react';
import {TextInput} from 'react-native';
import DomRestricted from 'subschema-component-form/lib/types/Restricted';
import {styleClass} from '../PropTypes';

export default class Restricted extends DomRestricted {

    static propTypes = {
        ...DomRestricted.propTypes,
        style: styleClass
    };
    static defaultProps = {
        ...DomRestricted.defaultProps,
        style: "Text.style"
    };
    state = {
        selection: {start: 0, end: 0}
    };

    refInput = (input) => {
        this._input = input;
    };
    handleSelectionRange = (caret) => {
        console.log('handleSelectionRange', caret, this.state.selection);
        /*  const input = this._input;
         if (!input)return;

         if (this.state.caret != null)
         input && input.selectionState.overlaps(this.state.caret, this.state.caret);
         */
    };

    handleSelection = ({nativeEvent: {selection}}) => {
        console.log('selection', selection);
        //   this.setState({selection});
        this.setState({selection})
    };
    handleValueChange = (value) => {
        this._value(value, false);
    };
    _value(str, isBackspace, caret = 0) {
        const value = this.handleState(str, isBackspace, caret);
        this.props.onChange(value.value);
        this.props.onValid(value.isValid, value);
        this._input.focus();
        const selection = {start: caret + 1, end: caret + 1};
        console.log('_value', value, selection);
        this.setState({...value, selection});
    }

    handleKeyDown = (e) => {
        const key = e.nativeEvent.key;
        console.log('key', key);
        if (this.props.onKeyDown) {
            this.props.onKeyDown.call(this, e);
        }
        let pos = this.state.selection.start, end = this.state.selection.end, value = (this.state.value || '');
        if (key === 'Enter') {
            this.props.onValid(this.state.hasValidValue, {
                isValid: this.state.hasValidValue,
                value: this.state.value
            });
            return;
        }
        if (key === 'Delete') {
            //  e.preventDefault();
            value = value.substring(0, pos) + value.substring(end);
            this._value(value, false, pos);
            return;
        }
        if (key === 'Backspace') {
            //e.preventDefault();
            //e.stopPropagation();
            let back = false;
            if (pos === end) {
                value = value.trim().substring(0, value.length - 1);
                back = true;
            } else {
                value = value.substring(0, pos) + value.substring(end);
            }
            this._value(value, back, pos + value.length);
            return;
        }
        /*  if (key !== 'Unidentified') {
         return;
         }*/
        /* if (key === 'Shift'){
         this._shift = true;
         return
         }
         */
        if (pos < value.length) {
            //This prevents onChange from firing.
            // e.preventDefault();
            // e.stopPropagation();
            let nvalue = value.split('');
            let char = key;
            if (!e.nativeEvent.shiftKey) {
                char = char.toLowerCase();
            }
            nvalue.splice(pos, Math.max(end - pos, 1), char);
            this._value(nvalue.join(''), false, pos);
        }
    };

    render() {
        const {caret, selection} = this.state;
        const {onValid, formatter, onChange, onKeyDown, fieldAttrs, value, ...props} = this.props;
        console.log('render', selection);
        return <TextInput ref={this.refInput}  {...props} {...fieldAttrs} value={this.state.value}
                          selection={selection}
                          onKeyPress={this.handleKeyDown}
                          onChangeText={this.handleValueChange}/>
    }
}
