var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants');

var Password = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render(){
        return <input id={this.props.name} onBlur={this.handleValidate} onChange={this.handleChange}
                      className={Constants.clz(Password.inputClassName, this.props.editorClass)} type="password"
                      value={this.getValue()} title={this.props.title}
                      placeholder={this.props.placeholder}/>
    }

});
module.exports = Password;