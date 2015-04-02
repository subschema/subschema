var React = require('react'), FieldMixin = require('../FieldMixin.jsx');

var SelectInput = React.createClass({
    mixins: [FieldMixin],
    render() {
        var {field, name, value} = this.props;
        var {title, placeholder} = field;
        var opts = this.props.field.options || [];
        return <select className="form-control" onBlur={this.handleValidate} onChange={this.handleChange}
                       name={name} value={value} title={title}
                       placeholder={placeholder}>
            {opts.map((o, i)=> {
                return <option key={'s' + i}>{o}</option>
            })}
        </select>
    }

})
module.exports = SelectInput;