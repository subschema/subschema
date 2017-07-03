import React, { PureComponent } from 'react';
import PropTypes from 'subschema-prop-types';

export default class TextArea extends PureComponent {
    static propTypes = {
        onChange   : PropTypes.targetEvent,
        onBlur     : PropTypes.blurValidate,
        onKeyDown  : PropTypes.event,
        onKeyUp    : PropTypes.event,
        onFocus    : PropTypes.event,
        onPaste    : PropTypes.event,
        value      : PropTypes.value,
        id         : PropTypes.id,
        name       : PropTypes.htmlFor,
        className  : PropTypes.typeClass,
        placeholder: PropTypes.string,
        fieldAttrs : PropTypes.fieldAttrs
    };

    render() {
        const { fieldAttrs, ...props } = this.props;
        return <textarea {...fieldAttrs} {...props}/>
    }
}
