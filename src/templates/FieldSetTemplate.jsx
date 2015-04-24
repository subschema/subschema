var React = require('../react');

var FieldSetTemplate = React.createClass({

    render(){
        var f = this.props.field;
        return f.legend ?
            <fieldset>
                <legend>{f.legend}</legend>
                {this.props.children}
            </fieldset> :
            <div>{this.props.children}</div>
    }

});


module.exports = FieldSetTemplate;