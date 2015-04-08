var React = require('react'), FieldMixin = require('../FieldMixin.jsx'), Constants = require('../Constants');


var Checkbox = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var className = Constants.clz(Checkbox.inputClassName, this.props.editorClass);
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={Checkbox.inputClassName} type="checkbox" value={this.state.value}
                      data-path={this.props.path}
                      title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = Checkbox;