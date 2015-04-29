var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var DateInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={css.forField(this)} type="date"
                      value={this.getValue()}
                      title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = DateInput;