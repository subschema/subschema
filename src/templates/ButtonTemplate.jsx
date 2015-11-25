"use strict";
import React, {Component} from 'react';

export default class Button extends Component {

    static defaultProps = {
        action: 'Submit',
        label: 'Submit',
        buttonClass: 'btn',
        iconClass: null
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        if (!this.state) this.state = {};
        this.state.disabled = props && props.disabled || false
    }

    handleClick = (e)=> {
        this.props.onClick(e, this.props.action, this);
    }

    render() {
        var {buttonClass, title, iconClass, onClick, label, ...props} = this.props;
        return <button className={buttonClass} title={title} disabled={this.state.disabled}
                       onClick={this.handleClick} {...props}>
            {iconClass ? <i className={iconClass}/> : null}
            {label}</button>
    }
}