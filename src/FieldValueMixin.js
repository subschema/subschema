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
            field: {},
            onValidate(){
            },
            onFocus(){
            },
            onBlur(){
            },
            onValid(){
            },
            onChange(){
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
        this.props.onChange.call(this, e);
        this.props.onValueChange(this.valueFromEvt(e));
    },
    handleValidate(e){
        if (this.props.onBlur) {
            this.props.onBlur.call(this, e);
        }
        this.props.onValidate(this.valueFromEvt(e), this, e);

    },
    template(){

    }

};
module.exports = FieldValueMixin;