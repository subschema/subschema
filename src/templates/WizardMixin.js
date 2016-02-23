'use strict'
import React, {Component} from 'react';
import ObjectType from '../types/Object.jsx';
import PropTypes from '../PropTypes';
function donner(d){
    d && d();
}
export default class WizardMixin extends Component {
    static contextTypes = {
        loader: PropTypes.loader,
        valueManager: PropTypes.valueManager
    };

    static defaultProps = {
        buttonsTemplate: 'ButtonsTemplate'
    };

    static propTypes = {
        schema: PropTypes.any,
        buttonsTemplate: PropTypes.template,
        onSubmit: PropTypes.event
    };

    state = {compState: 0, prevState: 0, maxState: 0};

    handleSubmit(e) {
    //    e && e.preventDefault();
        /*this._validate(function (errors) {
            if (errors) {

                this.setState({disabled: false});
                return;
            }

            if (!errors && this.props.onDone(donner, e, this.props.schema.fieldsets[this.state.compState]) === false) {
                return;
            }
        }.bind(this));*/
        this.props.onSubmit(e);
    };

    next = ()=> {
        const compState = this.state.compState, current = this.props.schema.fieldsets[compState], next = compState + 1;
        this.setState({disabled: true});
        this._validate(function (e) {
            if (e) {
                this.setState({disabled: false});
                return;
            }
            if (this.props.onNext((resp)=>this.go(next, resp), next, current) === false) {
                this.setState({disabled: false, maxState: Math.max(next, this.state.maxState)});
                return;
            }
        }.bind(this));
    };

    previous = ()=> {
        const compState = this.state.compState, current = this.props.schema.fieldsets[compState], next = compState - 1;
        this.setState({disabled: true});

        if (this.props.onPrevious((resp)=>this.go(next, resp), next, current) === false) {
            this.setState({disabled: false});
            return;
        }
    };


    go = (pos, resp)=> {
        if (resp === false) {
            this.setState({disabled: false});
            return;
        }
        this.setNavState(resp == null ? pos : resp);
    };

    _validate(done) {
        this.context.valueManager.validatePaths(this.props.schema.fieldsets[this.state.compState].fields, done)
    }


    handleOnClick = (evt)=> {
        const steps = this.props.schema.fieldsets.length, value = evt.target.value;
        if (value < steps && value <= this.state.maxState) {
            this.setNavState(value, true);
        }

    };


    handleKeyDown = (e)=> {
        if (e.which === 13) {
            if (this.state.compState < this.props.schema.fieldsets.length - 1) {
                return this.handleBtn(e, 'next');
            } else {
                return this.handleBtn(e, 'submit');
            }
        }
    };


    handleValidate = () => {
    };


    createButtons(state) {
        let {buttons} = this.props.schema.fieldsets[state];
        let rest = {};
        if (buttons) {
            if (buttons.buttons) {
                ({buttons, ...rest} = buttons);
            }
            if (!Array.isArray(buttons)) {
                buttons = [buttons];
            }
        }
        else {
            buttons = [];
            const {next, previous, last, ...restBtns} = this.props.buttons;
            rest = restBtns;
            const isFirst = state == 0,
                isLast = (state + 1 === this.props.schema.fieldsets.length);

            if (isLast) {
                if (!isFirst) {
                    buttons.push(previous);
                }
                buttons.push(last);
            } else if (isFirst) {
                buttons.push(next);
            } else {
                buttons.push(previous, next);
            }

        }

        buttons.forEach(function (b) {
            if (b.action === 'next' || b.action === 'submit') {
                b.disabled = this.disabled;
            }
        }, this.state);
        return {
            ...rest,
            buttons
        }
    }


    handleBtn(e, action, btn) {
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

    };


    handleEnter = ()=> {
        this.setState({animating: true})
    };


    handleLeave = (done)=> {
        this.setState({animating: false})
        done();
    };


}