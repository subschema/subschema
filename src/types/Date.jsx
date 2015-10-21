var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var DateInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    asInputValue(){
        if (this.state.value == null) {
            return '';
        }
        var value = new Date(this.state.value).toISOString().substring(0, 10);

        return value;
    },
    handleDateChange(e){
        this.props.onChange(e);
        var value = this.valueFromEvt(e);
        this.props.handleChange(new Date(value).getTime());
    },
    render() {
        var {onBlur,onValueChange,onChange, className, fieldAttrs, ...props} = this.props;
        return <input onBlur={this.handleValidate} onChange={this.handleDateChange} id={this.props.name}
                      className={css.forField(this)} type="date"
                      value={this.asInputValue()}
            {...props}
            {...fieldAttrs}
            />
    }
});

module.exports = DateInput;