'use strict'
import React, {Component} from 'react'
import ObjectType from '../types/Object.jsx';
import WizardMixin from './WizardMixin';
import tu from '../tutils';
import ButtonsTemplate from './ButtonsTemplate.jsx';
import EventCSSTransitionGroup from '../transition/EventCSSTransitionGroup.jsx';
import cssUtil from '../css';
import style from 'subschema-styles/WizardTemplate-style';
import PropTypes from '../PropTypes';
import defaults from 'lodash/object/defaults';
import template from '../decorators/template';

function donner(done) {
    done();
}

export default class WizardTemplate extends WizardMixin {
    static defaultProps = defaults({
        wizardProgressTemplate: 'WizardProgressTemplate',
        onNext: donner,
        onPrevious: donner,
        onDone: donner,
        buttons: {
            'buttonsStyle': style.buttons,
            'previous': {
                label: 'Previous',
                action: 'previous',
                buttonClass: style.previous
            },
            'next': {
                label: 'Next',
                action: 'next',
                buttonClass: style.next
            },
            'last': {
                label: 'Done',
                action: 'submit',
                buttonClass: style.done
            }
        },
        onAction: function (pos, action, wizard) {
        },
        onNavChange(current, previous, wizard){
        }
    }, WizardMixin.defaultProps);

    setNavState(next) {
        var len = this.props.schema.fieldsets.length, compState = this.state.compState;
        next = Math.max(Math.min(len - 1, next), 0);
        if (this.props.onNavChange(next, compState, this.props.schema.fieldsets[next]) !== false) {
            this.setState({
                compState: next,
                disabled: false,
                prevState: next === compState ? this.state.prevState : compState
            });
        }
    }

    @template('wizardProgressTemplate')
    renderProgress(Template, fieldsets) {
        return <Template fieldsets={fieldsets} index={this.state.compState}
                         onClick={this.handleOnClick}/>
    }
    render() {
        var {fieldsets, schema} = this.props.schema;
        var compState = this.state.compState,
            fields = fieldsets[compState].fields,
            transition = compState < this.state.prevState ? style.switchBack : style.switch;

        return (
            <div className={style.namespace+" "+(this.state.animating ? style.animating : '') }
                 onKeyDown={this.handleKeyDown}>
                {this.renderProgress(fieldsets)}

                <EventCSSTransitionGroup ref="anim" transitionName={transition} transitionEnter={true}
                                         transitionLeave={true}
                                         className={style.transitionContainer} onEnter={this.handleEnter}
                                         onDidLeave={this.handleLeave}>
                    <ObjectType ref="form"
                                className={style.componentState+compState}
                                key={"form-"+compState}
                                schema={{schema, fields}}
                                onSubmit={this.handleSubmit}>
                        {this.renderBtns(compState)}
                    </ObjectType>
                </EventCSSTransitionGroup>
            </div>
        );
    }
}