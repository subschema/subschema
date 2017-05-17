import React, {Component} from 'react';
import {Text} from 'react-native';
import PropTypes from 'subschema-prop-types';


export default class DisplayText extends Component {
    static propTypes = {
        ...Text.propTypes,
        style: PropTypes.style
    };

    render() {
        const {className, style, dangerouslySetInnerHTML, children, ...props} = this.props;

        return <Text {...props} style={className}>{children}</Text>
    }

};