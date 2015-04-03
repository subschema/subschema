var React = require('react'), FieldMixin = require('../FieldMixin.jsx');


var TextArea = React.createClass({
    mixins: [FieldMixin],
    render() {
        return <textarea onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                         className="form-control" value={this.getValue()}
                         data-path={this.props.path}
                         title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = TextArea;