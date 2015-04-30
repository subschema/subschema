var React = require('../react'), util = require('../tutils'),
    FieldMixin = require('../FieldMixin'), Constants = require('../Constants'),
    css = require('../css')
    ;
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
    handleSelect(e){
        if (this.props.field.multiple) {
            var placeholder = this.props.field.placeholder;
            //normalize multiple field selection
            var values = [], options = e.target.options, i = 0, l = options.length, option;
            for (; i < l; i++) {
                var option = options[i];
                if (option.selected) {
                    if (option.label != placeholder)
                        values.push(option.value);
                }
            }
            this.props.onValueChange(values);
            return
        }
        this.props.onValueChange(e.target.value);
    },
    renderOptions(value){
        var field = this.props.field, multiple = field.multiple, opts = field.options || [], hasValue = false, ret = opts.map(toLabelVal).map((o, i)=> {
            if (!hasValue && o.val + '' == '' + value) hasValue = true;
            return <option key={'s' + i} value={o.val}>{o.label}</option>
        });
        var placeholder = this.props.field && this.props.field.placeholder || this.props.placeholder;
        if (placeholder || (!multiple && !!hasValue)) {
            //fixes a bug in react where selecting null, does not select null.
            var selected = {};
            if (!hasValue) {
                selected.selected = true;
                selected.value = null;
            }
            ret.unshift(<option key={'null-' + opts.length} {...selected}>
                {placeholder}</option>);
        }
        return ret;
    },
    render() {
        var {field, name} = this.props;
        var value = this.state.value;
        var {title, placeholder, multiple} = field;
        if (multiple && !Array.isArray(value)) {
            value = value ? [value] : value;
        }
        return <select className={css.forField(this)}
                       multiple={multiple}
                       ref="input"
                       onBlur={this.handleValidate} onChange={this.handleSelect}
                       name={name} value={value} title={title}
            >
            {this.renderOptions(value)}
        </select>
    }

})
module.exports = Select;