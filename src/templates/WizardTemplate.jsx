'use strict'
var React = require('../React')
var ObjectType = require('../types/Object.jsx');
var tu = require('../tutils');
var NestedMixin = require('../NestedMixin');
var ButtonsTemplate = require('./ButtonsTemplate.jsx');
var EventCSSTransitionGroup = require('../transition/EventCSSTransitionGroup.jsx');
var cssUtil = require('../css');
var style = require('subschema-styles/WizardTemplate-style');
var PropTypes = require('../PropTypes');
function donner(done) {
    done();
}

var WizardTemplate = React.createClass({
    mixins: [require('./WizardMixin')],
    displayName: 'WizardTemplate',
    getDefaultProps(){
        return {
            wizardProgressTemplate: 'WizardProgressTemplate',
            onNext: donner,
            onPrevious: donner,
            buttons: {
                'buttonsStyle':style.buttons,
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
                'last':{
                    label: 'Done',
                    action: 'submit',
                    buttonClass: style.done
                }
            },
            onAction: function (pos, action, wizard) {
            },
            onNavChange(current, previous, wizard){
            },
            onDone: donner
        }
    },
    setNavState(next) {
       var len = this.schema.fieldsets.length, compState = this.state.compState;
        next = Math.max(Math.min(len - 1, next), 0);
        if (this.props.onNavChange(next, compState, this.schema.fieldsets[next]) !== false) {
            this.setState({
                compState: next,
                disabled: false,
                prevState: next === compState ? this.state.prevState : compState
            });
        }
    },
    render() {
        var {...schema} = this.schema.schema;
        var fieldsets = this.schema.fieldsets,
            compState = this.state.compState,
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
})

module.exports = WizardTemplate;