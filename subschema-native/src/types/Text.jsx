import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';

import {TextInput, findNodeHandle} from 'react-native';
import {style, onSubmitEditing} from '../PropTypes';

export default class Text extends Component {
    static displayName = 'Text';
    static propTypes = {
        onChange: PropTypes.valueEvent,
        secureTextEntry: PropTypes.bool,
        maxLength: PropTypes.number,
        multiline: PropTypes.bool,
        autoCorrect: PropTypes.bool,
        style,
        autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
        keyboardType: PropTypes.oneOf(["default", 'numeric', 'email-address', "ascii-capable", 'numbers-and-punctuation', 'url', 'number-pad', 'phone-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']),
        onSubmitEditing
    };
    static defaultProps = {
        secureTextEntry: false,
        autoCorrect: true,
        autoCapitalize: 'none',
        keyboardType: 'default',
        autoFocus: true
    };
    handleTextChange = (text) => {
        this.props.onChange(text);
    };
    handleKeyDown = (e) => {
        if (e.nativeEvent.key == 'Tab') {
            this._text && this._text.blur();
        }
    };

    handleRef = (node) => {
        this._text = node;
    };

    render() {
        var {onChange, name, style, styleClass, ...props} = this.props;
        return <TextInput ref={this.handleRef}
                          style={styleClass}
                          onChangeText={this.handleTextChange}
                          {...props}
                          onKeyPress={this.handleKeyDown}
        />;
    }

}
