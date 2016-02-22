"use strict";
import React, {Component} from 'react';
import PropTypes from '../PropTypes';

/**
 * Manages the the fieldset.  It  uses FieldSetTemplate or similar, but now
 * it renders the buttons, so the Template does not have to handle that.
 *
 */
export default class FieldSet extends Component {
    static propTypes = {
        fieldsets: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.field,
            fieldsets: PropTypes.arrayOf(PropTypes.shape({
                field: PropTypes.field
            }))
        })),
        buttons: PropTypes.any,
        onButtonClick: PropTypes.event,
        onSubmit: PropTypes.event,
        onCancel: PropTypes.event,
        field: PropTypes.any,
        legend: PropTypes.any,
        template: PropTypes.template,
        buttonsTemplate: PropTypes.template
    };

    static defaultProps = {
        template: 'FieldSetTemplate',
        buttonsTemplate: 'ButtonsTemplate'
    };


    renderButtons(buttons) {
        if (!buttons) {
            return null;
        }
        const ButtonsTemplate = this.props.buttonsTemplate;
        if (!buttons.buttons) {
            buttons = {
                buttons
            };
        }
        return <ButtonsTemplate onButtonClick={this.props.onButtonClick} onClick={this.props.onClick}  {...buttons}/>
    }

    render() {

        const {template,children, buttons, field, ...rest}  = this.props;
        const FieldSetTemplate = template;
        return <FieldSetTemplate  {...rest} {...field} buttons={this.renderButtons(buttons)}>
            {children}
        </FieldSetTemplate>
    }

}
