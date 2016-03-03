"use strict";
import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import CSSReplaceTransition from '../transition/ReactCSSReplaceTransition.jsx';
import UninjectedConditional from './Conditional.jsx';
import UninjectedContent from '../types/Content.jsx';
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
        Content: PropTypes.injectClass
    };

    static defaultProps = {
        template: 'FieldSetTemplate',
        buttonsTemplate: 'ButtonsTemplate',
        Content: UninjectedContent
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
        return <ButtonsTemplate key="buttons" onButtonClick={this.props.onButtonClick}
                                onClick={this.props.onClick}  {...buttons}/>
    }

    renderContent(Content, content){
        if (content){
           return <Content key={`content-${key}`} content={content}/>
        }
    }
    renderFieldSet(key) {

        const {Content, template,children, buttons, content, field, ...rest}  = this.props;
        const FieldSetTemplate = template;
        return <FieldSetTemplate key={key}  {...rest} {...field} buttons={this.renderButtons(buttons)} content={this.renderContent(Content,content)}>
            {children}
        </FieldSetTemplate>

    }

    render() {
        if (this.props.transition) {
            return (<CSSReplaceTransition {...this.props.transition}>
                {this.renderFieldSet('transition')}
            </CSSReplaceTransition>);
        }
        if (this.props.conditional) {
            const {Conditional, ...rest} = this.props.conditional;
            return (<Conditional {...rest}>
                {this.renderFieldSet('conditional')}
            </Conditional>);
        }
        return this.renderFieldSet();
    }

}
