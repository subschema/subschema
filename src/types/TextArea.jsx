var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var TextArea = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var {fieldAttrs, value, onBlur, onChange, onValueChange, ...props} = this.props;
        return <textarea onBlur={this.handleValidate}
                         onChange={this.handleChange}
                         id={this.props.name}
                         className={css.forField(this)}
                         value={this.state.value}

            {...props}
            {...fieldAttrs}
            />
    }
});

module.exports = TextArea;