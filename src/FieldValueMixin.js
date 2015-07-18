var FieldValueMixin = {
    mixins: [require('./BasicFieldMixin'), require('./FieldValueDefaultPropsMixin')],

    getValue(){
        return this.state && this.state.value;
    },
    setValue(value){
        this.setState({
            value
        });
    },
    handleChange(e) {
        this.props.onChange(e);
        this.props.handleChange(this.valueFromEvt(e));
    },
    handleValidate(e){
        this.props.onBlur.call(this, e);
        this.props.onValidate(this.valueFromEvt(e), this, e);

    },
    template(){

    }

};
module.exports = FieldValueMixin;