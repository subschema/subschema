var HandleFieldValueMixin = {
    handleChange(e) {
        this.props.onChange(e);
        this.props.handleChange(this.valueFromEvt(e));
    },
    handleValidate(e){
        this.props.onBlur.call(this, e);
        this.props.onValidate(this.valueFromEvt(e), this, e);

    }
}
module.exports = HandleFieldValueMixin;