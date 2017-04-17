"use strict";
import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import RenderContent from './RenderContent';
import RenderTemplate from './RenderTemplate';

/**
 * Manages the the fieldset.  It  uses FieldSetTemplate or similar, but now
 * it renders the buttons, so the Template does not have to handle that.
 *
 */
function cleanField(src) {
    const {buttons, field, template, legend, transition, content, conditional, fieldsets, ...rest}= src;
    return rest;
}
export default class FieldSet extends Component {
    static displayName = "FieldSet";
    static propTypes = {
        fieldsets: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.field,
            fieldsets: PropTypes.arrayOf(PropTypes.shape({
                field: PropTypes.field
            }))
        })),
        conditional: PropTypes.conditional,
        buttons: PropTypes.any,
        onButtonClick: PropTypes.event,
        onCancel: PropTypes.event,
        field: PropTypes.any,
        legend: PropTypes.any,
        template: PropTypes.template,
        transition: PropTypes.transition,
        buttonsTemplate: PropTypes.template,
        content: PropTypes.content
    };

    static defaultProps = {
        template: 'FieldSetTemplate',
        buttonsTemplate: 'ButtonsTemplate'
    };


    renderButtons(buttons) {
        if (!buttons) {
            return null;
        }
        if (!buttons.buttons) {
            buttons = {
                buttons
            };
        }
        return <RenderTemplate template={this.props.buttonsTemplate} key="buttons"
                               onButtonClick={this.props.onButtonClick}
                               onClick={this.props.onClick}  {...buttons}/>
    }


    renderFieldSet(key) {

        const {template,children, style, buttons, content, field, ...rest}  = this.props;
        const renderedContent = content ? <RenderContent content={content}  key={`content-${key}`}/> : null;
        return <RenderTemplate template={template} {...cleanField(field)} key={key}  {...rest} field={field}
                               buttons={this.renderButtons(buttons)}
                               content={renderedContent}>
            {children}
        </RenderTemplate>

    }

    render() {
        if (this.props.transition) {
            const {Transition, ...transition} = this.props.transition;
            return (<Transition {...transition}>
                {this.renderFieldSet('transition')}
            </Transition>);
        }
        if (this.props.conditional) {
            const {Conditional, ...conditional} = this.props.conditional;
            return (<Conditional {...conditional}>
                {this.renderFieldSet('conditional')}
            </Conditional>);
        }
        return this.renderFieldSet();
    }

}
