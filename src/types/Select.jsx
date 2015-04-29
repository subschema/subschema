var React = require('../react'), util = require('../tutils'),
    FieldMixin = require('../FieldMixin'), Constants = require('../Constants');
function toLabelVal(v) {
    if (util.isString(v)) {
        return {
            label: v,
            val: v
        }
    }
    if (v == null) {
        return {
            label: 'No Value',
            val: null
        }
    }

    return v;
}
var Select = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName

    },

    renderOptions(value){
        var opts = this.props.field.options || [], hasValue = false, ret = opts.map(toLabelVal).map((o, i)=> {
            if (!hasValue && o.val == value) hasValue = true;
            return <option key={'s' + i} value={o.val}>{o.label}</option>
        });
        if (this.props.placeholder || !hasValue) {
            ret.unshift(<option key={'s' + opts.length}
                                value={null}>{this.props.placeholder || "Please Select"}</option>);
        }
        return ret;
    },
    render() {
        var {field, name} = this.props;
        var value = this.state.value;
        var {title, placeholder} = field;
        var opts = this.props.field.options || [];
        var hasValue = opts.some(function (v) {
                return (v === value || v.val === value);
            }) || value == null;

        return <select className={Constants.clz(Select.inputClassName, this.props.fieldClass)}
                       onBlur={this.handleValidate} onChange={this.handleChange}
                       name={name} value={this.getValue()} title={title}
            >
            {this.renderOptions(value)}
        </select>
    }

})
module.exports = Select;