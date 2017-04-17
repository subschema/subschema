"use strict";
import React, {Component} from "react";
import {isString, extend} from "../tutils";
import PropTypes from "../PropTypes";
import RenderTemplate from "../components/RenderTemplate";

export default class ButtonsTemplate extends Component {
    static defaultProps = {
        buttonTemplate: 'ButtonTemplate',
        buttons: [{
            action: 'submit',
            label: 'Submit',
            type: 'submit',
            template: 'Button',
            primary: true
        }],
        onButtonClick (event, action, btn, value) {

        }
    };

    static propTypes = {
        buttonTemplate: PropTypes.template,
        buttonClass: PropTypes.cssClass,
        style: PropTypes.style
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
            if (btn.primary) {
                btn.buttonClass = `${btn.buttonClass} ${this.props.primaryClass}`;
            }
            return btn;
        });
    }

    render() {
        let {buttons, buttonTemplate, buttonsClass, buttonContainerClass} = this.props;
        if (buttons.buttons) {
            buttonsClass = buttons.buttonsClass || buttonsClass;
            buttons = buttons.buttons
        }
        return (<div className={buttonContainerClass}>
            <div className={buttonsClass}>
                {this.makeButtons(buttons).map(
                    (b, i) => <RenderTemplate template={buttonTemplate} key={"btn-"+i} {...b}/>)
                }

            </div>
        </div>);
    }

}
