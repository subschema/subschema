'use strict'
var React = require('../react')
var Form = require('../form');
var tu = require('../tutils');
var NestedMixin = require('../NestedMixin');
var ButtonsTemplate = require('./ButtonsTemplate.jsx');
var EventCSSTransitionGroup = require('../transition/EventCSSTransitionGroup.jsx');
var LoaderMixin = require('../LoaderMixin');
var cssUtil = require('../css');
var style = require('../styles/WizardTemplate-style');

function donner(done) {
    done();
}

var WizardTemplate = React.createClass({
    mixins: [LoaderMixin],
    displayName: 'WizardTemplate',
    getDefaultProps(){
        return {
            wizardProgressTemplate: 'WizardProgressTemplate',
            onNext: donner,
            onPrevious: donner,
            onAction: function (pos, action, wizard) {
            },
            onNavChange(current, previous, wizard){
            },
            onDone: donner
        }
    },
    getInitialState() {

        return {
            compState: 0,
            prevState: 0,
            maxState: 0
        }
    },
    componentWillMount(){
        this.assignSchema(this.props);

    },
    componentWillReceiveProps(props){
        this.assignSchema(props);
    },
    assignSchema(props){
        this.schema = NestedMixin.normalizeSchema(NestedMixin.extractSchema(props), props.loader);
    },
    next(){
        var compState = this.state.compState, current = this.schema.fieldsets[compState], next = compState + 1;
        this.setState({disabled: true});
        this._validate((e)=> {
            if (e) {
                this.setState({disabled: false});
                return;
            }
            if (this.props.onNext((resp)=>this.go(next, resp), next, current) === false) {
                this.setState({disabled: false, maxState: Math.max(next, this.state.maxState)});
                return;
            }
        });
    },
    previous(){
        var compState = this.state.compState, current = this.schema.fieldsets[compState], next = compState - 1;
        this.setState({disabled: true});

        if (this.props.onPrevious((resp)=>this.go(next, resp), next, current) === false) {
            this.setState({disabled: false});
            return;
        }
    },
    go(pos, resp){
        if (resp === false) {
            this.setState({disabled: false});
            return;
        }
        this.setNavState(resp == null ? pos : resp);
    },
    _validate(done){
        this.props.valueManager.validatePaths(this.schema.fieldsets[this.state.compState].fields, done)
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

    handleOnClick(evt) {
        var steps = this.schema.fieldsets.length, value = evt.target.value;
        if (value < steps && value <= this.state.maxState) {
            this.setNavState(value, true);
        }

    },

    handleKeyDown(e) {
        if (e.which === 13) {
            if (this.state.compState < this.schema.fieldsets.length - 1) {
                return this.handleBtn(e, 'next');
            } else {
                return this.handleBtn(e, 'submit');
            }
        }
    },
    handleValidate(){
    },
    handleSubmit(e){
        this._validate((errors)=> {
            if (!errors && this.props.onDone((submit)=> {
                    if (submit !== false) {
                        this.props.onSubmit(e, errors, this.props.valueManager.getValue());
                    }
                }, e, this.schema.fieldsets[this.state.compState]) === false) {
                return;
            }
        })
    },

    /* renderState(compState){
     var schema = tu.extend({}, this.schema.schema);
     var fields = this.schema.fieldsets[compState].fields;

     return <Form ref="form" key={"key-"+compState} schema={{
     schema,
     fields
     }} onSubmit={this.handleSubmit}
     valueManager={this.props.valueManager}>

     {this.renderBtns(compState)}
     </Form>
     },*/
    renderBtns(compState){
        var buttons = this.schema.fieldsets[compState].buttons;
        if (!buttons && buttons !== false) {
            buttons = [];
            var isFirst = compState === 0, isLast = compState === this.schema.fieldsets.length - 1;
            if (!isFirst) {
                buttons.push({
                    label: 'Previous',
                    action: 'previous'
                });
            }
            if (isLast) {
                buttons.push({
                    label: 'Done',
                    action: 'submit',
                    buttonClass: 'btn-primary'
                });
            } else {
                buttons.push({
                    label: 'Next',
                    action: 'next',
                    buttonClass: 'btn-primary'
                });
            }
        }
        if (buttons) {
            buttons.forEach(function (b) {
                if (b.action === 'next' || b.action === 'submit') {
                    b.disabled = this.disabled;
                }
            }, this.state);
        }
        return <ButtonsTemplate key={'btn-'+compState} className={style.buttons} buttons={buttons}
                                onClick={this.handleBtn}/>
    },
    handleBtn(e, action, btn){
        e && e.preventDefault();
        switch (action) {

            case 'previous':
            {
                this.previous();
                break;
            }
            case 'next':
            {
                this.next();
                break;
            }
            case 'submit':
            {
                this.handleSubmit(e);
                break;
            }
            default:
            {
                this.props.onAction(this.state.compState, action, this);
            }
        }

    },
    handleEnter(){
        this.setState({animating: true})
    },
    handleLeave(done){
        this.setState({animating: false})
        done();
    },
    renderProgress(fieldsets){
        if (this.props.wizardProgressTemplate === false) {
            return null;
        }
        var Template = this.props.loader.loadTemplate(this.props.wizardProgressTemplate);
        if (!Template) {
            return null;
        }
        return <Template fieldsets={fieldsets} valueManager={this.props.valueManager} index={this.state.compState}
                         onClick={this.handleOnClick}/>
    },
    render() {

        var fieldsets = this.schema.fieldsets,
            schema = tu.extend({}, this.schema.schema),
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
                    <Form ref="form"
                          className={style.componentState+compState}
                          key={"form-"+compState}
                          schema={{schema, fields}}
                          onSubmit={this.handleSubmit}
                          valueManager={this.props.valueManager}>
                        {this.renderBtns(compState)}
                    </Form>
                </EventCSSTransitionGroup>
            </div>
        );
    }
})

module.exports = WizardTemplate;