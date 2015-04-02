var React = require('react');
var PropsStateValueMixin = require('./PropsStateValueMixin.js');
var FieldMixin = {
    getDefaultProps() {
        return {
            value: '',
            title: '',
            name: '',
            placeholder: '',
            dataType: this.dataType,
            onValueChange() {
            },
            onValidate(){
            }
        }

    },
    dataType: 'text',

    getValue(){
        return this.props.value;
    },

    valueFromEvt(e){
        return e.target.value;
    },
    handleChange(e) {
        var value = this.valueFromEvt(e);
        this.props.onValueChange(value, this.props.value, this.props.name, this.props.path);
    },
    handleValidate(e){
        this.props.onValidate(this.valueFromEvt(e), this.props.value, this.props.name, this.props.path);
    }

};

module.exports = FieldMixin;