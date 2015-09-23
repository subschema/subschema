var React = require('../react');
var ButtonsTemplate = require('./ButtonsTemplate.jsx');
var FieldSetTemplate = React.createClass({
    renderButtons(){
        var buttons = this.props.field && this.props.field.buttons;
        if (!buttons) {
            return null;
        }
        if (buttons.buttons) {
            return <ButtonsTemplate ref="buttons" loader={this.props.loader} valueManager={this.props.valueManager} {...buttons}/>
        }
        return <ButtonsTemplate  ref="buttons" loader={this.props.loader} valueManager={this.props.valueManager} buttons={buttons}/>
    },
    render(){
        var f = this.props.field;
        return f.legend ?
            <fieldset>
                <legend>{f.legend}</legend>
                {this.props.children}
                {this.renderButtons()}
            </fieldset> :
            <div>
                {this.props.children}
                {this.renderButtons()}
            </div>
    }

});


module.exports = FieldSetTemplate;