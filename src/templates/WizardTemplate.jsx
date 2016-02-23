'use strict'
import React, {Component} from 'react'
import UninjectedObjectType from '../types/Object.jsx';
import WizardMixin from './WizardMixin';
import ButtonsTemplate from './ButtonsTemplate.jsx';
import EventCSSTransitionGroup from '../transition/EventCSSTransitionGroup.jsx';
import cssUtil from '../css';
import style from 'subschema-styles/WizardTemplate-style';
import PropTypes from '../PropTypes';
import defaults from 'lodash/object/defaults';

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
            'buttonsClass': style.buttons,
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
        },
        ObjectType: UninjectedObjectType
    }, WizardMixin.defaultProps);

    static propTypes = {
        ...WizardMixin.propTypes,
        ObjectType: PropTypes.injectClass,
        wizardProgressTemplate: PropTypes.template
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
        return Template ? <Template fieldsets={fieldsets} index={this.state.compState}
                                    onClick={this.handleOnClick}/> : null;
    }

    render() {
        const {ObjectType} = this.props;
        const {fieldsets, schema} = this.props.schema;
        const compState = this.state.compState,
            current = fieldsets[compState],
            fields = current.fields,
            transition = compState < this.state.prevState ? style.switchBack : style.switch;
        const buttons = current.buttons ? current.buttons : this.createButtons(compState);
        const currentSchema = {schema, fieldsets: [{fields, buttons}]};
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
                                template="ObjectTemplate"
                                schema={currentSchema}
                                onButtonClick={this::this.handleBtn}
                               >
                    </ObjectType>
                </EventCSSTransitionGroup>

            </div>
        );
    }
}