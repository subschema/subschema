import React, {Component} from 'react';
import ButtonsTemplate from './ButtonsTemplate.jsx';
import PropTypes from  '../PropTypes';
import {noop} from '../tutils';

export default class FieldSetTemplate extends Component {
    static propTypes = {
        buttons: PropTypes.buttons,
        legend: PropTypes.node,
        className: PropTypes.cssClass,
        onButtonClick: PropTypes.event,
        onClick: PropTypes.event
    };

    static defaultProps = {};


    renderButtons(buttons) {
        if (!buttons) {
            return null;
        }
        if (buttons.buttons) {
            return <ButtonsTemplate onButtonClick={this.props.onButtonClick} onClick={this.props.onClick}
                {...buttons}/>
        }
        return <ButtonsTemplate onButtonClick={this.props.onButtonClick} onClick={this.props.onClick}
                                buttons={buttons}/>
    }

    render() {
        var {legend, buttons, className, ...rest} = this.props.field || {};
        return legend ?
            <fieldset className={className}>
                <legend>{legend}</legend>
                {this.props.children}
                {this.renderButtons(buttons)}
            </fieldset> :
            <div className={className}>
                {this.props.children}
                {this.renderButtons(buttons)}
            </div>
    }
}