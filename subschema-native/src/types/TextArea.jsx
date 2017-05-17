import React from 'react';
import Text from './Text';


export default class TextArea extends Text {

    static displayName = 'TextArea';

    static defaultProps = {
        secureTextEntry: false,
        autoCorrect: true,
        autoCapitalize: 'none',
        keyboardType: 'default',
        autoFocus: true,
        multiline: true
    };


}