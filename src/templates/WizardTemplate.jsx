'use strict'
const React = require('react/addons')
const Form = require('../form.jsx');
const tu = require('../tutils');
const NestedMixin = require('../NestedMixin.jsx');
const css = require('../styles/wizard.less')
const ButtonsTemplate = require('./ButtonsTemplate.jsx');

function getNavStates(indx, length) {
    let styles = []
    for (let i = 0; i < length; i++) {
        if (i < indx) {
            styles.push('done')
        }
        else if (i === indx) {
            styles.push('doing')
        }
        else {
            styles.push('todo')
        }
    }
    return {current: indx, styles: styles}
}

const Wizard = React.createClass({
    statics: {
        getNavStates
    },
    getInitialState() {
        var {schema, subSchema,  fields, submitButton,  template, ...props} = this.props;
        schema = NestedMixin.normalizeSchema(schema || subSchema);
        this.schema = schema.schema ? schema : {schema: schema, fields: fields};
        return {
            compState: 0,
            navState: getNavStates(0, this.schema.fieldsets.length),
            values: []
        }
    },

    setNavState(next) {
        var len = this.schema.fieldsets.length;
        this.setState({navState: getNavStates(next, len)})
        if (next < len) {
            this.setState({compState: next})
        }
    },

    handleOnClick(evt) {
        var steps = this.schema.fieldsets.length;
        if (evt.target.value === steps - 1 &&
            this.state.compState === steps - 1) {
            this.setNavState(steps);
        }
        else {
            this.setNavState(evt.target.value);
        }
    },

    handleKeyDown(evt) {
        if (evt.which === 13) {
            this.setNavState(this.state.compState + 1)
        }
    },
    handleValidate(){
    },
    handleSubmit(){
    },

    renderState(compState){
        var schema = tu.extend({}, this.schema.schema);
        var fields = this.schema.fieldsets[compState].fields;

        return <Form ref="form" schema={{
        schema,
        fields
        }} onValidate={this.handleValidate} onSubmit={this.handleSubmit} value={this.state.values[0] || this.props.value}>

            {this.renderBtns(compState)}
        </Form>
    },
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
        return <ButtonsTemplate buttons={buttons} handler={this.handleBtn}/>
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
                var messages = form.validate();
                this.state.values[this.state.compState] = form.getValue();
                if (!messages) {
                    this.setNavState(this.state.compState + 1);
                }
                break;
            }
            case 'submit':
            {
                var messages = form.validate();
                this.state.values[this.state.compState] = form.getValue();
                if (!messages) {
                    this.setNavState(this.state.compState + 1);
                }
                var data = {};
                this.state.values.forEach(function (v) {
                    tu.extend(data, v);
                })
                this.handleSubmit(data, messages);
                break;

            }
        }

    },
    render() {

        var {schema, subSchema,  fields, submitButton,  template, ...props} = this.props;

        var fieldsets = this.schema.fieldsets;
        return (
            <div className="container" onKeyDown={this.handleKeyDown}>
                <ol className="progtrckr">{
                    fieldsets.map((s, i) =>
                            <li value={i} key={i}
                                className={"progtrckr-" + this.state.navState.styles[i]}
                                onClick={this.handleOnClick}>
                                <em>{i + 1}</em>
                                <span>{s.legend}</span>
                            </li>
                    )}
                </ol>
                {this.renderState(this.state.compState)}
            </div>
        )
    }
})

module.exports = Wizard;