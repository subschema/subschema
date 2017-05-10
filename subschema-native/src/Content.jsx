import React from 'react';
import ContentCore from 'subschema-core/lib/Content';
import ReactNative, {Text} from 'react-native';
import DefaultContentWrapper from 'subschema-core/lib/ContentWrapper';

class ContentWrapper extends DefaultContentWrapper {
    render() {
        const {type, content, dataType, children, context, path, fieldAttrs, ...props} = this.props;

        const allProps = {
            ...fieldAttrs,
            ...props,
        };
        if (typeof type == 'string') {
            return <Text {...allProps}>{content}</Text>
        }
        const Type = type;
        return <Type {...allProps}/>;

    }
}
ContentCore.Types = ReactNative;
ContentCore.defaultProps.type = 'Text';
ContentCore.defaultProps.contentWrapper= ContentWrapper;

export default ContentCore;