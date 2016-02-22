"use strict";
import React, {Component, PropTypes} from 'react';

export default class Button extends Component {

    static defaultProps = {
        action: 'Submit',
        label: 'Submit',
        buttonClass: 'btn',
        iconClass: null,
        disabled: false
    };
    static propTypes = {
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        title: PropTypes.string,
        buttonClass: PropTypes.string,
        iconClass: PropTypes.string,
        action: PropTypes.string,
        label: PropTypes.string,
        className: PropTypes.string
    };

    handleClick = (e)=> {
        this.props.onClick(e, this.props.action, this);
    };

    render() {
        const { buttonClass, className, title, iconClass, onClick,  label, ...props} = this.props;
        return <button className={className || buttonClass} {...props} onClick={this::this.handleClick}>
            {iconClass ? <i className={iconClass}/> : null}
            {label}</button>
    }
}