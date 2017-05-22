import React, {Component} from 'react';
import Button from '../component/button';
import ButtonTemplate from 'subschema-component-form/lib/templates/ButtonTemplate';
import {styleClass} from '../PropTypes';

export default class ButtonTemplateNative extends ButtonTemplate {
    static propTypes = {
        ...ButtonTemplate.propTypes,
        buttonClass: styleClass,
        iconClass: styleClass,
        buttonTextClass: styleClass
    };
    static defaultProps = {
        ...ButtonTemplate.defaultProps,
        buttonClass: null,
        iconClass: null
    };

    state = {
        disabled: false
    };
    _handlePress = (e) => {
        this.handleClick(e);
    };

    render() {
        let {buttonClass, buttonTextClass, title, iconStyle, onClick, label, ...props} = this.props;
        return <Button disabled={this.state.disabled}
                       containerStyle={buttonClass}
                       style={buttonTextClass}
                       onPress={this._handlePress} {...props}>
            {label}</Button>
    }
}
