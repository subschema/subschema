import React, {Component} from 'react';
import {View} from 'react-native';
import ObjectTemplate from 'subschema-component-form/lib/templates/ObjectTemplate';

export default class ObjectTemplateNative extends Component {
    static propTypes = ObjectTemplate.propTypes;
    static defaultProps = ObjectTemplate.defaultProps;

    render() {
        const {children, className, fieldAttrs, ...props} = this.props;
        return (<View {...fieldAttrs}>
            {children}
        </View>);
    }
}