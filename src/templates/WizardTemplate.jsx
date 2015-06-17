'use strict'
var React = require('../react')
var Form = require('../form');
var tu = require('../tutils');
var NestedMixin = require('../NestedMixin');
var css = require('../styles/wizard.less');
var ButtonsTemplate = require('./ButtonsTemplate.jsx');
//var TimeoutTransitionGroup = require('../transition/TimeoutTransitionGroup.jsx');
var ReactCSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;
var Wizard = React.createClass({

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
/*    componentWillMount(){
        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);

    },
    componentWillUnmount(){
        this.props.valueManager.removeListener(this.props.path, this.setValue, this, true);
   },
    setValue(value){
        this.setState({value});
    },*/
    getNavStates(indx, length) {
        let styles = [], values = this.state && this.state.values || [];
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
            if (values[i] && values[i].errors) {
                styles[i] += ' error';
            }
        }
        return {current: Math.min(indx, length - 1), styles: styles}
    },
    setNavState(next) {
        var len = this.schema.fieldsets.length;
        this.setState({
                navState: this.getNavStates(next, len),
                prevState: this.state.compState,
                compState: Math.min(len - 1, next)
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
    handleSubmit(e, errors, value){
        this.props.onSubmit(e, errors, value);
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
        return <ButtonsTemplate key={'btn-'+compState} buttons={buttons} onClick={this.handleBtn}/>
    },
    handleBtn(e, action, btn){
        e && e.preventDefault();
        var form = this.refs.form;

        switch (action) {

            case 'previous':
            {
                this.setNavState(this.state.compState - 1);
                break;
            }
            case 'next':
            {
                var errors = this.props.valueManager.validate(), compState = this.state.compState;
                this.state.values[compState] = {value: form.getValue(), errors};
                if (!errors) {
                    this.setNavState(compState + 1);
                } else {
                    this.setNavState(compState);
                }
                break;
            }
            case 'submit':
            {
                var errors = this.props.valueManager.validate();
                this.state.values[this.state.compState] = {value: form.getValue(), errors};
                var data = {};
                this.state.values.forEach(function (v) {
                    tu.extend(data, v.value);
                });
                this.setNavState(this.state.compState + 1);
                this.handleSubmit(e, errors, data);
                break;

            }
        }

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
                <ReactCSSTransitionGroup transitionName={transition} transitionEnter={true} transitionLeave={true}
                                         className='slide-container'>
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