'use strict'
var React = require('../react')
var Form = require('../form');
var tu = require('../tutils');
var NestedMixin = require('../NestedMixin');
var css = require('../styles/wizard.less');
var ButtonsTemplate = require('./ButtonsTemplate.jsx');
//var TimeoutTransitionGroup = require('../transition/TimeoutTransitionGroup.jsx');
var ReactCSSTransitionGroup = require('../transition/EventCSSTransitionGroup.jsx')
var CSSCore = require("react/lib/CSSCore");
var Wizard = React.createClass({
    getDefaultProps(){
        return {
            onNext(){
            },
            onPrevious(){
            },
            onDone(){
            }
        }
    },
    getInitialState() {
        var {schema, subSchema,  fields,  ...props} = this.props;
        schema = NestedMixin.normalizeSchema(schema || subSchema);
        this.schema = schema.schema ? schema : {schema: schema, fields: fields};
        return {
            compState: 0,
            prevState: 0,
            navState: this.getNavStates(0, this.schema.fieldsets.length),
            values: []
        }
    },
    getNavStates(indx, length) {
        let styles = [];
        for (let i = 0; i < length; i++) {
            if (i < indx || indx == length) {
                styles.push('done')
            }
            else if (i === indx) {
                styles.push('doing')
            }
            else {
                styles.push('todo')
            }
        }
        return {current: Math.min(indx, length - 1), styles: styles}
    },
    setNavState(next) {
        var len = this.schema.fieldsets.length;
        if (next > this.state.compState) {
            if (this.props.onNext(next) === false) {
                this.setState({disabled: false});
                return;
            }
        } else if (next < this.state.compState) {
            if (this.props.onPrevious(next) === false) {
                this.setState({disabled: false});
                return;
            }
        }
        this.setState({
                navState: this.getNavStates(next, len),
                prevState: this.state.compState,
                compState: Math.min(len - 1, next),
                disabled: false
            }
        )
    },

    handleOnClick(evt) {
        var steps = this.schema.fieldsets.length, value = evt.target.value;
        if (value < steps && value <= this.state.values.length) {
            this.setNavState(value);
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
        this.props.onSubmit(e, this.props.valueManager.getErrors(), this.props.valueManager.getValue());
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
        return <ButtonsTemplate key={'btn-'+compState} buttons={buttons} onClick={this.handleBtn}/>
    },
    handleBtn(e, action, btn){
        e && e.preventDefault();
        var compState = this.state.compState;
        this.setState({disabled: true});
        switch (action) {

            case 'previous':
            {
                this.setNavState(this.state.compState - 1);
                break;
            }
            case 'next':
            {
                this.props.valueManager.validatePaths(this.schema.fieldsets[compState].fields, (errors)=> {
                    if (!errors) {
                        this.setNavState(compState + 1);
                        return;
                    } else {
                        this.setState({disabled: false})
                    }
                });
                break;
            }
            case 'submit':
            {
                this.props.valueManager.validatePaths(this.schema.fieldsets[compState].fields, (errors)=> {

                    this.setState({disabled: false});
                    if (!errors)
                        this.handleSubmit(e);
                });
                break;
            }
        }

    },
    handleEnter(){
        console.log('enter');
        CSSCore.addClass(this.refs.anim.getDOMNode(), 'overflow-hidden');
    },
    handleLeave(done){
        console.log('leave');
        CSSCore.removeClass(this.refs.anim.getDOMNode(), 'overflow-hidden');
        done();
    },
    render() {

        var fieldsets = this.schema.fieldsets;
        var schema = tu.extend({}, this.schema.schema);
        var compState = this.state.compState;
        var fields = this.schema.fieldsets[compState].fields;
        var transition = compState < this.state.prevState ? 'wizardSwitchBack' : 'wizardSwitch';

        return (
            <div className="wizard-container" onKeyDown={this.handleKeyDown}>
                <ol className="progtrckr">{
                    fieldsets.map((s, i) =>
                            <li value={i} key={'li'+i}
                                className={"progtrckr-" + this.state.navState.styles[i]}
                                onClick={this.handleOnClick}>
                                <em>{i + 1}</em>
                                <span>{s.legend}</span>
                            </li>
                    )}
                </ol>
                <ReactCSSTransitionGroup ref="anim" transitionName={transition} transitionEnter={true} transitionLeave={true}
                                         className='slide-container' onEnter={this.handleEnter} onDidLeave={this.handleLeave}>
                    <Form ref="form"
                          className={'compState w'+compState}
                          key={"form-"+compState}
                          schema={{schema, fields}}
                          onSubmit={this.handleSubmit}
                          valueManager={this.props.valueManager}>
                        {this.renderBtns(compState)}
                    </Form>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
})

module.exports = Wizard;