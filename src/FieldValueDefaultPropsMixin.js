var FieldValueDefaultPropsMixin = {
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

    }
};
module.exports = FieldValueDefaultPropsMixin;