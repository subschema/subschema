"use strict";
import React, {Component} from 'react';
import {isString, extend} from '../tutils';
import style from 'subschema-styles/ButtonsTemplate-style';
import Template from '../components/Template.jsx';

export default class ButtonsTemplate extends Component {
    static defaultProps = {
        buttonsClass: style.buttonsClass,
        buttonClass: style.buttonClass,
        buttonTemplate: 'ButtonTemplate',
        buttons: [{
            action: 'submit',
            label: 'Submit',
            template: 'Button'
        }],
        onButtonClick: function (event, action, btn, value) {

        }
    }

    makeButtons(buttons) {
        var onClick = this.props.onButtonClick || this.props.onClick, buttonTemplate = this.props.buttonTemplate;
        return buttons.map((b)=> {
            onClick = b.onClick || onClick;
            var btn = isString(b) ? {
                action: b,
                label: b,
                template: buttonTemplate,
                onClick
            } : extend({}, b, {onClick, template: buttonTemplate});
            if (this.props.buttonClass) {
                btn.buttonClass = (btn.buttonClass || '') + ' ' + this.props.buttonClass;
            }
            return btn;
        })
    }

    render() {
        var {buttons,buttonsClass} = this.props;
        if (buttons.buttons) {
            buttonsClass = buttons.buttonsClass || buttonsClass;
            buttons = buttons.buttons
        }
        return <div className={style.formGroup}>
            <div className={buttonsClass}>
                {this.makeButtons(buttons).map((b, i)=> {
                    return <Template key={"btn-"+i} {...b}/>
                    })}
            </div>
        </div>
    }

}