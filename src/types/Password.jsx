var React = require('../react'), FieldMixin = require('../FieldMixin'),
    Constants = require('../Constants'),
    css = require('../css');
;

var Password = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render(){
        return <input id={this.props.name} onBlur={this.handleValidate} onChange={this.handleChange}
                      className={css.forField(this)} type="password"
                      value={this.getValue()} title={this.props.title}
                      placeholder={this.props.placeholder}/>
    }

});
module.exports = Password;