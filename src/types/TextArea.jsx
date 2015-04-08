var React = require('react'), FieldMixin = require('../FieldMixin.jsx'), Constants = require('../Constants');


var TextArea = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <textarea onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                         className={Constants.clz(TextArea.inputClassName, this.props.editorClass)}
                         value={this.getValue()}
                         data-path={this.props.path}
                         title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = TextArea;