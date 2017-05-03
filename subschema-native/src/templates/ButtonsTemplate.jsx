import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {Text, View, StyleSheet} from 'react-native';
import Button  from './ButtonTemplate';
import ButtonsTemplate from 'subschema-component-form/lib/templates/ButtonsTemplate';
import tutils from 'subschema-utils';
const {propTypes, defaultProps} = ButtonsTemplate;
const {isString} = tutils;

export default class ButtonsTemplateNative extends Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    makeButtons(buttons) {
        var onClick = this.props.onButtonClick || this.props.onClick;
        return buttons.map((b) => {
            onClick = b.onClick || onClick;

            var btn = isString(b) ? {
                action: b,
                label: b,
                onClick
            } : Object.assign({}, b, {onClick});

            if (this.props.buttonClass) {
                btn.buttonClass = (btn.buttonClass || '') + ' ' + this.props.buttonClass;
            }
            return btn;
        })
    }

    render() {
        var {buttons, buttonsClass} = this.props;
        if (buttons.buttons) {
            buttonsClass = buttons.buttonsClass || buttonsClass;
            buttons = buttons.buttons
        }
        return <View>
            {this.makeButtons(buttons).map((b, i) => {
                return <Button key={"btn-" + i} {...b}/>
            })}
        </View>
    }

}