import React, {Component} from 'react';
import Button from '../component/button';
import ButtonTemplate from 'subschema-component-form/lib/templates/ButtonTemplate';
import {styleClass} from '../PropTypes';

export default class ButtonTemplateNative extends ButtonTemplate {
    static propTypes = {
        ...ButtonTemplate.propTypes,
        buttonClass:styleClass,
        iconClass: styleClass,

    };

    state = {
        disabled: false
    };
    _handlePress = (e)=>{
        this.handleClick(e);
    };
    render() {
        let {buttonClass, title, iconStyle, onClick, label, ...props} = this.props;
        return <Button disabled={this.state.disabled} style={buttonClass}
                       onPress={this._handlePress} {...props}>
            {label}</Button>
    }
}
