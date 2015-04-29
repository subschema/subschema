var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var TextInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={css.forField(this)} type={this.props.dataType}
                      value={this.getValue()}
                      data-path={this.props.path}
                      title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = TextInput;