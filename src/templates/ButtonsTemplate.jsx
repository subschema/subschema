"use strict";
import React, {Component} from 'react';
import {isString, extend} from '../tutils';
import style from 'subschema-styles/ButtonsTemplate-style';
import {styleToProps} from '../css';
import PropTypes from '../PropTypes';

export default class ButtonsTemplate extends Component {
    static defaultProps = styleToProps(style, {
        buttonTemplate: 'ButtonTemplate',
        buttons: [{
            action: 'submit',
            label: 'Submit',
            template: 'Button'
        }],
        onButtonClick (event, action, btn, value) {

        }
    });

    static propTypes = {
        buttonTemplate: PropTypes.template,
        buttonClass: PropTypes.cssClass
    };

    makeButtons(buttons) {
        let onClick = this.props.onButtonClick || this.props.onClick, buttonTemplate = this.props.buttonTemplate;
        return buttons.map(b => {
            onClick = b.onClick || onClick;
            const btn = isString(b) ? {
                action: b,
                label: b,
                onClick
            } : extend({}, b, {onClick, template: buttonTemplate});
            if (this.props.buttonClass) {
                btn.buttonClass = `${btn.buttonClass || ''} ${this.props.buttonClass || ''}`;
            }
            return btn;
        });
    }

    render() {
        let {buttons, buttonTemplate,buttonsClass,buttonContainerClass} = this.props;
        if (buttons.buttons) {
            buttonsClass = buttons.buttonsClass || buttonsClass;
            buttons = buttons.buttons
        }
        const ButtonTemplate = buttonTemplate;
        return (<div className={buttonContainerClass}>
            <div className={buttonsClass}>
                {this.makeButtons(buttons).map((b, i) => <ButtonTemplate key={"btn-"+i} {...b}/>)}
            </div>
        </div>);
    }

}