import React, { PureComponent } from 'react';
import Text from './Text';

export default class Password extends Text {
    static defaultProps = {
        ...Text.defaultProps,
        type: 'password'
    };

    render() {
        return <Text {...this.props}/>
    }

}
