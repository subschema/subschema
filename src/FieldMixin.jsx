var React = require('react'), tu = require('./tutils'), BasicFieldMixin = require('./BasicFieldMixin.jsx');
var FieldMixin = tu.extend({}, BasicFieldMixin, {
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
    valueFromEvt(e){
        return e.target.value;
    },
    handleChange(e) {
        this.updateValue(this.valueFromEvt(e));
    },
    handleValidate(e){
        this.props.onValidate(this.valueFromEvt(e), this, e);
    }

});

module.exports = FieldMixin;