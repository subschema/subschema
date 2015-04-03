var React = require('react'), FieldMixin = require('../FieldMixin.jsx');

var Password = React.createClass({
    mixins: [FieldMixin],
    render(){
        return <input id={this.props.name} onBlur={this.handleValidate} onChange={this.handleChange}
                      className="form-control" type="password" value={this.getValue()} title={this.props.title}
                      placeholder={this.props.placeholder}/>
    }

});
module.exports = Password;