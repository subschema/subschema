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
        var {onBlur, onChange, onValueChange, value, fieldAttrs, ...props} =this.props;
        return <input id={this.props.name} onBlur={this.handleValidate} onChange={this.handleChange}
                      className={css.forField(this)} type="password"
                      value={this.state.value}
            {...props}
            {...fieldAttrs}
            />
    }

});
module.exports = Password;