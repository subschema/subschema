import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {FREEZE_OBJ} from 'subschema-utils';


function strip(obj) {
    return !obj ? FREEZE_OBJ : Object.keys(obj).reduce(function (ret, key) {
        if (key == 'dataType' || key == 'fieldAttrs' || obj[key] == null) return ret;
        ret[key] = obj[key];
        return ret;
    }, {});
}
export default class ContentWrapper extends Component {
    static defaultProps = {
        type: 'span',
        content: ''
    };

    static propTypes = {
        content: PropTypes.expression,
        type: PropTypes.domType,
        value: PropTypes.any,
        onChange: PropTypes.any,
        title: PropTypes.any,
        className: PropTypes.cssClass,
        id: PropTypes.any,
        name: PropTypes.any,
        fieldAttrs: PropTypes.any
    };

    render() {
        const {type, content, dataType, children, context, path, fieldAttrs, ...props} = this.props;

        const allProps = {
            ...strip(fieldAttrs),
            ...props,
        };
        if (typeof type == 'string') {
            return React.createElement(type, {
                ...allProps,
                dangerouslySetInnerHTML: {__html: content}
            });
        }
        const Type = type;
        return <Type {...allProps}/>;

    }
}