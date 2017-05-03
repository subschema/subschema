import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {TextInput, StyleSheet} from 'react-native';

var styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#9da3a6',
        borderWidth: 1,
        borderRadius: 5,
        paddingTop: 6,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 6
    }
});

export default class Text extends Component {
    static propTypes = {
        onChange: PropTypes.valueEvent,
        secureTextEntry: PropTypes.bool,
        maxLength: PropTypes.number,
        multiline: PropTypes.bool,
        autoCorrect: PropTypes.bool,
        autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
        keyboardType: PropTypes.oneOf(["default", 'numeric', 'email-address', "ascii-capable", 'numbers-and-punctuation', 'url', 'number-pad', 'phone-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search'])
    };
    static defaultProps = {
        secureTextEntry: false,
        autoCorrect: true,
        autoCapitalize: 'none',
        keyboardType: 'default'
    };
    handleTextChange = (text) => {
        this.props.onChange(text);
    };

    render() {
        var {onChange, name, ...props} = this.props;
        return <TextInput
            style={styles.input}
            onChangeText={this.handleTextChange}
            {...props}
        />;
    }

}
