"use strict";
import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import RenderContent from './RenderContent.jsx';
import RenderTemplate from './RenderTemplate.jsx';

/**
 * Manages the the fieldset.  It  uses FieldSetTemplate or similar, but now
 * it renders the buttons, so the Template does not have to handle that.
 *
 */
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
        onSubmit: PropTypes.event,
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

        const {template,children, buttons, content, field, ...rest}  = this.props;
        return <RenderTemplate template={template} key={key}  {...rest} {...field} buttons={this.renderButtons(buttons)}
                               content={<RenderContent content={content}  key={`content-${key}`}/>}>
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
