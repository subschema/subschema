import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import RenderContent from './RenderContent';
import renderTemplate from './RenderTemplate';
/**
 * Manages the the fieldset.  It  uses FieldSetTemplate or similar, but now
 * it renders the buttons, so the Template does not have to handle that.
 *
 */
function cleanField(src) {
    const { buttons, field, template, legend, transition, content, conditional, fieldsets, ...rest } = src;
    return rest;
}
function hasCancel({ action }) {
    return action === 'cancel' || action === 'close' || action === 'reset';
}
export default class FieldSet extends Component {
    static contextTypes = {
        valueManager: PropTypes.valueManager
    };
    static displayName  = "FieldSet";
    static propTypes    = {
        fieldsets      : PropTypes.fieldset,
        conditional    : PropTypes.conditional,
        buttons        : PropTypes.buttons,
        onButtonClick  : PropTypes.event,
        onCancel       : PropTypes.event,
        field          : PropTypes.any,
        legend         : PropTypes.any,
        template       : PropTypes.template,
        transition     : PropTypes.transition,
        buttonsTemplate: PropTypes.template,
        content        : PropTypes.content,
        validate       : PropTypes.bool
    };

    static defaultProps = {
        template       : 'FieldSetTemplate',
        buttonsTemplate: 'ButtonsTemplate'
    };

    renderFieldSet(key) {

        const { template, children, onButtonClick, buttonsTemplate, style, buttons, content, field, ...rest } = this.props;
        if (buttons) {
            if (!buttons.template) {
                buttons.template = buttonsTemplate;
            }
            if (!buttons.onButtonClick) {
                buttons.onButtonClick = onButtonClick;
            }
            rest.buttons = buttons;
        }
        const renderedContent = content ? <RenderContent content={content}
                                                         key={`content-${key}`}/>
            : null;
        return renderTemplate({
            template: template,
            ...cleanField(field),
            ...rest,
            key     : key,
            field   : field,
            content : renderedContent,
            children
        });

    }

    render() {
        if (this.props.transition) {
            const { Transition, ...transition } = this.props.transition;
            return (<Transition {...transition}>
                {this.renderFieldSet('transition')}
            </Transition>);
        }
        if (this.props.conditional) {
            const { Conditional, ...conditional } = this.props.conditional;
            return (<Conditional {...conditional}>
                {this.renderFieldSet('conditional')}
            </Conditional>);
        }
        return this.renderFieldSet();
    }

}
