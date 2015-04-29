var BasicFieldMixin = require('./BasicFieldMixin');
var FieldValueMixin = {
    mixins: [BasicFieldMixin],
    getDefaultProps() {
        return {
            title: '',
            name: '',
            placeholder: '',
            dataType: this.dataType,
            editorClass: '',
            onValidate(){
            }
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
        this.props.onValueChange(this.valueFromEvt(e));
    },
    handleValidate(e){
        this.props.onValidate(this.valueFromEvt(e), this, e);
    },
    template(){

    }

};
module.exports = FieldValueMixin;