var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var Checkbox = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: ''//Constants.inputClassName,
    },
    doChange: function (e) {
        var hasProp = 'value' in this.props;
        this.props.handleChange(e.target.checked ? hasProp ? this.props.value : true : hasProp ? null : false);
    },
    render() {
        var {onValueChange, onChange,value, type, dataType, checkedClass, fieldAttrs, className, onBlur, ...props} = this.props;
        dataType = dataType || 'checkbox';
        return <input onBlur={this.handleValidate} onChange={this.doChange} id={this.props.name}
                      className={ (this.state.value ? checkedClass || '' : '' )+' '+css.forField(this)}
                      checked={this.state.value}
                      type={dataType}
            {...props}
            {...fieldAttrs}
            />
    }
});

module.exports = Checkbox;
