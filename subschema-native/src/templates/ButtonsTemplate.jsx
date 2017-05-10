import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Button  from './ButtonTemplate';
import ButtonsTemplate from 'subschema-component-form/lib/templates/ButtonsTemplate';
import {styleClass} from '../PropTypes';
import PropTypes from 'subschema-prop-types';
const isString = (val) => {
    if (val == null) return false;
    return (typeof val === 'string')
};

const ifArray = (...args) => {
    const ret = [];
    for (var i = 0, l = args.length; i < l; i++) {
        if (args[i] != null) {
            ret.push(args[i]);
        }
    }
    return ret.length == 0 ? null : ret.length === 1 ? ret[0] : ret;
};

export default class ButtonsTemplateNative extends ButtonsTemplate {
    static propTypes = {
        ...ButtonsTemplate.propTypes,
        buttonClass: styleClass,
        onClick: PropTypes.func
    };

    makeButtons(buttons) {
        let onClick = this.props.onButtonClick || this.props.onClick, buttonTemplate = this.props.buttonTemplate;
        return buttons.map(b => {
            onClick = b.onClick || onClick;
            const btn = isString(b) ? {
                action: b,
                label: b,
                onClick
            } : {...b, onClick, template: buttonTemplate};
            if (this.props.buttonClass) {
                btn.buttonClass = ifArray(btn.buttonClass, this.props.buttonClass);
            }
            if (btn.primary) {
                btn.buttonClass = ifArray(btn.buttonClass, this.props.primaryClass);
            }
            return btn;
        });
    }

    render() {
        let {buttons, buttonsClass} = this.props;
        if (buttons.buttons) {
            buttonsClass = buttons.buttonsClass || buttonsClass;
            buttons = buttons.buttons
        }
        return <View style={buttonsClass}>
            {this.makeButtons(buttons).map((b, i) => {
                return <Button key={"btn-" + i} {...b}/>
            })}
        </View>
    }

}