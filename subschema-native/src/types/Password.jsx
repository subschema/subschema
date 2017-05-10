import React, {Component} from 'react';
import Text from './Text';

export default class Password extends Component {
    static propTypes = Text.propTypes;
    static defaultProps = {
        ...Text.defaultProps,
        secureTextEntry: true
    };

    render() {
        return <Text {...this.props}/>;
    }

}
