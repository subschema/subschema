'use strict'
import React, {Component} from 'react';
import ObjectType from '../types/Object.jsx';
import PropTypes from '../PropTypes';

function donner(done) {
    if (typeof done === 'function')
        done();
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
        buttonsTemplate: PropTypes.template
    };
    state = {};

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state.compState = 0;
        this.state.prevState = 0;
        this.state.maxState = 0;
    }

    next = ()=> {
        var compState = this.state.compState, current = this.props.schema.fieldsets[compState], next = compState + 1;
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
    };

    previous = ()=> {
        var compState = this.state.compState, current = this.props.schema.fieldsets[compState], next = compState - 1;
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
        var steps = this.props.schema.fieldsets.length, value = evt.target.value;
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

    handleSubmit = (e)=> {
        this._validate((errors)=> {
            if (!errors && this.props.onDone((submit)=> {
                    if (submit !== false) {
                        this.props.onSubmit(e, errors, this.context.valueManager.getValue());
                    }
                }, e, this.props.schema.fieldsets[this.state.compState]) === false) {
                return;
            }
        })
    };

    renderBtns(compState) {
        const ButtonsTemplate = this.props.buttonsTemplate;
        var buttons = this.props.schema.fieldsets[compState].buttons;
        if (!buttons && buttons !== false) {
            buttons = [];
            var isFirst = compState === 0, isLast = compState === this.props.schema.fieldsets.length - 1;
            if (!isFirst) {
                buttons.push(this.props.buttons.previous);
            }
            if (isLast) {
                buttons.push(this.props.buttons.last);
            } else {
                buttons.push(this.props.buttons.next);
            }
        }
        if (buttons) {
            buttons.forEach(function (b) {
                if (b.action === 'next' || b.action === 'submit') {
                    b.disabled = this.disabled;
                }
            }, this.state);
        }
        return <ButtonsTemplate key={'btn-'+compState} className={this.props.buttons.buttonsStyle} buttons={buttons}
                                onButtonClick={this.handleBtn}/>
    }


    handleBtn = (e, action, btn)=> {
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