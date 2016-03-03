'use strict'
import React, {Component} from 'react'
import ObjectType from '../types/Object.jsx';
import WizardMixin from './WizardMixin';
import ButtonsTemplate from './ButtonsTemplate.jsx';
import EventCSSTransitionGroup from '../transition/EventCSSTransitionGroup.jsx';
import PropTypes from '../PropTypes';
import defaults from 'lodash/object/defaults';
import ReactCSSTransitionReplace from '../transition/ReactCSSReplaceTransition.jsx';


function donner(done) {
    done();
}

export default class WizardTemplate extends WizardMixin {
    static defaultProps = defaults({
        wizardProgressTemplate: 'WizardProgressTemplate',
        Template: 'ObjectTemplate',
        onNext: donner,
        onPrevious: donner,
        onDone: donner,
        buttons: {
            'previous': {
                label: 'Previous',
                action: 'previous'
            },
            'next': {
                label: 'Next',
                action: 'next',
                primary: true
            },
            'last': {
                label: 'Done',
                action: 'submit',
                primary: true
            }
        },
        onAction: function (pos, action, wizard) {
        },
        onNavChange(current, previous, wizard){
        },
        transitionForward: "slideRight",
        transitionBackward: "slideLeft",
        namespaceClass: 'wizard'
        // ObjectType: UninjectedObjectType
    }, WizardMixin.defaultProps);

    static propTypes = {
        ...WizardMixin.propTypes,
        wizardProgressTemplate: PropTypes.template,
        Template: PropTypes.template,
        transitionForward: PropTypes.transition,
        transitionBackward: PropTypes.transition,
        style: PropTypes.style
    };

    setNavState(next) {
        const len = this.props.schema.fieldsets.length, compState = this.state.compState;
        next = Math.max(Math.min(len - 1, next), 0);
        if (this.props.onNavChange(next, compState, this.props.schema.fieldsets[next]) !== false) {
            this.setState({
                compState: next,
                disabled: false,
                prevState: next === compState ? this.state.prevState : compState
            });
        }
    }

    renderProgress(fieldsets) {
        const Template = this.props.wizardProgressTemplate;
        return Template ?
            <Template fieldsets={fieldsets} index={this.state.done ? fieldsets.length : this.state.compState}
                      onClick={this.handleOnClick}/> : null;
    }

    makeTransition(compState) {
        if (compState < this.state.prevState) {
            return this.props.transitionForward;
        } else {
            return this.props.transitionBackward;
        }
    }

    render() {
        let {className, Template, template, fieldsets, fields, onButtonClick,transitionLeaveTimeout,  transitionEnterTimeout, carouselHeightClass, children, schema, ...rest} = this.props;
        ({fieldsets, schema} = this.props.schema);
        const compState = this.state.compState,
            current = fieldsets[compState],
            transition = this.makeTransition(compState);
        const buttons = current.buttons ? current.buttons : this.createButtons(compState);
        const currentSchema = {schema, fieldsets: [{buttons, ...current, legend: false}], Template};
        return (
            <div className={`${this.props.namespaceClass} ${(this.state.animating ? this.props.animatingClass : '')}`}
                 onKeyDown={this.handleKeyDown}>
                {this.renderProgress(fieldsets)}
                <ReactCSSTransitionReplace {...transition}>

                    <ObjectType {...rest}
                        className={`state-${compState}`}
                        key={"form-"+compState}
                        schema={currentSchema}
                        onButtonClick={this::this.handleBtn}
                    />
                </ReactCSSTransitionReplace>
            </div>
        );
    }
}