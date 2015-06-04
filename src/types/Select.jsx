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
        if (this.props.multiple) {
            var placeholder = this.props.placeholder;
            //normalize multiple field selection
            var values = [], options = e.target.options, i = 0, l = options.length, option;
            for (; i < l; i++) {
                var option = options[i];
                if (option.selected) {
                    if (option.label != placeholder)
                        values.push(option.value);
                }
            }
            this.props.handleChange(values);
            return
        }else if (this.props.placeholder){
            if (e.target.value === this.props.placeholder){
                this.props.handleChange(null);
                return;
            }
        }


        this.props.handleChange(e.target.value);
    },
    renderOptions(value){
        var props = this.props, multiple = props.multiple, opts = props.options || [], hasValue = false, ret = opts.map(toLabelVal).map((o, i)=> {
            if (!hasValue && o.val + '' == '' + value) hasValue = true;
            return <option key={'s' + i} value={o.val}>{o.label}</option>
        });
        var placeholder = this.props.placeholder;
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
        var {field, onChange, fieldAttrs, onBlur, value, multiple, placeholder, name, ...props} = this.props;
        var value = this.state.value;
        if (multiple && !Array.isArray(value)) {
            value = value ? [value] : value;
        }
        return <select className={css.forField(this)}
                       multiple={multiple}
                       ref="input"
                       value={value}
                       onBlur={this.handleValidate} onChange={this.handleSelect}
            {...props}
            {...fieldAttrs}
            >
            {this.renderOptions(value)}
        </select>
    }

})
module.exports = Select;