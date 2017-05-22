import React from 'react';
import Text from './Text';

export default class Password extends Text {
    static propTypes = Text.propTypes;
    static defaultProps = {
        ...Text.defaultProps,
        secureTextEntry: true
    };

}
