'use strict'
import React, {Component} from 'react';
import ObjectType from '../types/Object';
import PropTypes from '../PropTypes';
import UninjectedField from '../components/Field';
import UninjectedFieldSet from '../components/FieldSet';
function donner(d) {
    d && d();
}
function fields(feildset) {
    if (!feildset)return [];
    if (feildset.fields) {
        return feildset.fields;
    }
    if (Array.isArray(feildset)) {
        return feildset.reduce(function (ret, fs) {
            ret.push(...fields(fs));
            return ret;
        }, []);
    }

    if (feildset.fieldsets) {
        return fields(feildset.fieldsets);
    }
    return [];

}
export default class WizardMixin extends Component {
    static contextTypes = {
        valueManager: PropTypes.valueManager
    };

    static defaultProps = {
        buttonsTemplate: 'ButtonsTemplate',
        Field: UninjectedField,
        FieldSet: UninjectedFieldSet
    };

    static propTypes = {
        schema: PropTypes.any,
        buttonsTemplate: PropTypes.template,
        onSubmit: PropTypes.submit,
        FieldSet: PropTypes.injectClass,
        Field: PropTypes.injectClass
    };

    state = {compState: 0, prevState: 0, maxState: 0, done: false};

    handleSubmit(e) {
        //    e && e.preventDefault();
        this._validate(function (errors) {
            if (errors) {

                this.setState({disabled: false, done: false});
                return;
            }

            this.setState({done: true});
            this.props.onSubmit(e);
            return;
        }.bind(this));

    }

    next() {
        const compState = this.state.compState,
            nextState = compState + 1,
            current = this.props.schema.fieldsets[compState];
        this.setState({disabled: true});
        this._validate(function (e) {
            if (e) {
                this.setState({disabled: false, done: false});
                return;
            }
            if (this.props.onNext((resp)=>this.go(nextState, resp), nextState, current) === false) {
                this.setState({disabled: false, done: false, maxState: Math.max(nextState, this.state.maxState)});
                return;
            }
        }.bind(this));
    }

    previous() {
        const compState = this.state.compState,
            nextState = compState - 1,
            current = this.props.schema.fieldsets[compState];

        this.setState({disabled: true});
        if (this.props.onPrevious((resp)=>this.go(nextState, resp), nextState, current) === false) {
            this.setState({disabled: false, done: false});
            return;
        }
    };


    go(pos, resp) {
        if (resp === false) {
            this.setState({disabled: false, done: false});
            return;
        }
        this.setNavState(resp == null ? pos : resp);
    }

    _validate(done) {
        const paths = fields(this.props.schema.fieldsets[this.state.compState]);
        this.context.valueManager.validatePaths(paths, done)
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
                    buttons.push({buttonClass: this.props.previousClass, ...previous});
                }
                buttons.push({buttonClass: this.props.lastClass, primary:true, ...last});
            } else if (isFirst) {
                buttons.push({buttonClass: this.props.nextClass, primary:true, ...next});
            } else {
                buttons.push({buttonClass: this.props.previousClass, ...previous}, {buttonClass: this.props.nextClass, primary:true,  ...next});
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
