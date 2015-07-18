var React = require('../react'), Constants = require('../Constants'), css = require('../css');


var Number = React.createClass({
    mixins: [require('../BasicFieldMixin'), require('../FieldValueDefaultPropsMixin')],
    statics: {
        inputClassName: Constants.inputClassName
    },
    getInitialState(){
        return {
            value: null
        }
    },
    getValue(){
        return this.state && this.state.value;
    },
    setValue(value){
        this.setState({
            value
        });
    },
    handleChange(e) {
        var value = e.target.value;
        this.props.onChange(e);
        //Not a valid number but valid to become a number
        if (/^(-\.|-|)[0-9]*\.?$/.test(value)) {
            this.setValue(value);
            //actual numbers.
        } else if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
                .test(value)) {

            if (this.props.valueManager.update(this.props.path, parseFloat(value, 10)) !== false) {
                this.props.onValueChange(value);
            }
        }
    },
    handleValidate(e){
        this.props.onBlur.call(this, e);

        this.props.onValidate(this.state.value, this, e);

    },
    render() {
        var {onChange, onValueChange, onBlur, className, field, value, dataType, value, fieldAttrs, type, ...props} = this.props
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={css.forField(this)}

                      value={this.state.value}
            {...props} {...fieldAttrs}
                      type={dataType || 'text'}
            />
    }
});

module.exports = Number;
