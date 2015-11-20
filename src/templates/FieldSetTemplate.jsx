import React, {Component} from 'react';
import ButtonsTemplate from './ButtonsTemplate.jsx';

export default class FieldSetTemplate extends Component {
    renderButtons(buttons){
        if (!buttons) {
            return null;
        }
        if (buttons.buttons) {
            return <ButtonsTemplate ref="buttons" onButtonClick={this.props.onButtonClick} onClick={this.props.onClick}
                {...buttons}/>
        }
        return <ButtonsTemplate ref="buttons" onButtonClick={this.props.onButtonClick} onClick={this.props.onClick}
                                buttons={buttons}/>
    }
    render(){
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