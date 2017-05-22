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

function addClass(classes, add) {
    if (add == null) return classes;
    if (classes == null) {
        classes = [];
    } else if (!Array.isArray(classes)) {
        classes = [classes];
    }
    if (Array.isArray(add)) {
        for (const clz of add) {
            if (classes.indexOf(clz) == -1)
                classes.push(...add);
        }
    } else {
        if (classes.indexOf(add) == -1)
            classes.push(add);
    }
    return classes;
};

export default class ButtonsTemplateNative extends ButtonsTemplate {
    static propTypes = {
        ...ButtonsTemplate.propTypes,
        style: PropTypes.any,
        buttonsClass: styleClass,
        buttonClass: styleClass,
        primaryClass: styleClass,
        primaryTextClass: styleClass,
        buttonFirstClass: styleClass,
        buttonLastClass: styleClass,
        textClass: styleClass,
        onClick: PropTypes.func
    };
    static defaultProps = {
        ...ButtonsTemplate.defaultProps,
        buttonClass: null
    };

    makeButtons(buttons) {
        let onClick = this.props.onButtonClick || this.props.onClick, buttonTemplate = this.props.buttonTemplate;

        const {length} = buttons;
        return buttons.map((b, i) => {
            onClick = b.onClick || onClick;
            const btn = isString(b) ? {
                action: b,
                label: b,
                onClick
            } : {...b, onClick, template: buttonTemplate};
            if (this.props.buttonClass) {
                btn.buttonClass = btn.buttonClass || this.props.buttonClass;
                btn.buttonTextClass = this.props.textClass;
            }
            if (btn.primary && this.props.primaryClass) {
                btn.buttonClass = this.props.primaryClass;
                btn.buttonTextClass = this.props.primaryTextClass || this.props.textClass;
            }
            if (i == 0) {
                btn.buttonClass = addClass(btn.buttonClass, this.props.buttonFirstClass);
            }
            if (i + 1 === length) {
                btn.buttonClass = addClass(btn.buttonClass, this.props.buttonLastClass);
            }
            return <Button key={"btn-" + i} {...btn}/>;
        });
    }



    render() {
        let {buttons, buttonsClass} = this.props;
        if (buttons.buttons) {
            buttonsClass = buttons.buttonsClass || buttonsClass;
            buttons = buttons.buttons
        }
        return <View style={buttonsClass}>
            {this.makeButtons(buttons)}
        </View>
    }

}