var React = require('react'), FieldMixin = require('../FieldMixin.jsx'), Constants = require('../Constants');

var SelectInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var {field, name, value} = this.props;
        var {title, placeholder} = field;
        var opts = this.props.field.options || [];
        return <select className={Constants.clz(SelectInput.inputClassName, this.props.editorClass)}
                       onBlur={this.handleValidate} onChange={this.handleChange}
                       name={name} value={this.getValue()} title={title}
                       placeholder={placeholder}>
            {opts.map((o, i)=> {
                return <option key={'s' + i} value={o.val|| o}>{o.label || o}</option>
            })}
        </select>
    }

})
module.exports = SelectInput;