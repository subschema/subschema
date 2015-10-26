var React = require('../react');
var ButtonsTemplate = require('./ButtonsTemplate.jsx');
var FieldSetTemplate = React.createClass({
    renderButtons(buttons){
        if (!buttons) {
            return null;
        }
        if (buttons.buttons) {
            return <ButtonsTemplate ref="buttons" loader={this.props.loader} onButtonClick={this.props.onButtonClick} onClick={this.props.onClick}
                                    valueManager={this.props.valueManager} {...buttons}/>
        }
        return <ButtonsTemplate ref="buttons" loader={this.props.loader} onButtonClick={this.props.onButtonClick} onClick={this.props.onClick}
                                valueManager={this.props.valueManager} buttons={buttons}/>
    },
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

});


module.exports = FieldSetTemplate;