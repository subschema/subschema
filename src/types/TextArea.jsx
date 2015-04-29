var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var TextArea = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <textarea onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                         className={css.forField(this)}
                         value={this.getValue()}
                         data-path={this.props.path}
                         title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = TextArea;