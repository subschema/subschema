'use strict'
import React, {Component} from 'react'
import ObjectType from '../types/Object';
import WizardMixin from './WizardMixin';
import PropTypes from '../PropTypes';
import defaults from 'lodash/defaults';
import RenderTemplate from '../components/RenderTemplate';

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
                type:"submit",
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

        return <RenderTemplate key="progress-template-key" template={this.props.wizardProgressTemplate}
                               fieldsets={fieldsets}
                               index={this.state.done ? fieldsets.length : this.state.compState}
                               onClick={this.handleOnClick}/>;
    }

    makeTransition(compState) {
        if (compState < this.state.prevState) {
            return this.props.transitionForward;
        } else {
            return this.props.transitionBackward;
        }
    }
    _handleBtn = (...args)=>{
        return this.handleBtn(...args);
    };

    render() {
        let {className, Template, template, fieldsets, fields, onButtonClick,transitionLeaveTimeout,  transitionEnterTimeout, carouselHeightClass, children, schema, ...rest} = this.props;
        ({fieldsets, schema} = this.props.schema);
        const compState = this.state.compState,
            current = fieldsets[compState],
            {Transition, ...transition} = this.makeTransition(compState);
        const buttons = current.buttons ? current.buttons : this.createButtons(compState);
        const currentSchema = {schema, fieldsets: [{buttons, ...current, legend: false}], template: Template};
        return (
            <div className={`${this.props.namespaceClass} ${(this.state.animating ? this.props.animatingClass : '')}`}
                 onKeyDown={this.handleKeyDown}>
                {this.renderProgress(fieldsets)}
                <Transition key="wizard-transition" {...transition}>

                    <ObjectType {...rest}
                        className={`clearfix state-${compState}`}
                        key={"form-"+compState}
                        schema={currentSchema}

                        onButtonClick={this._handleBtn}
                    />
                </Transition>
            </div>
        );
    }
}
