var React = require('react');
var FieldMixin = {
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
    componentWillMount(){
        if (this.props.value) {
            this.props.valueManager.setValue(this.props.value);
        }
        if (this.props.errors) {
            this.props.valueManager.setErrors(this.props.errors);
        }
        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);
        this.props.valueManager.addListener(this.props.path, this.props.onValueChange, this);
    },
    componentWillUnmount(){
        this.props.valueManager.removeListener(this.props.path, this.setValue, this);
        this.props.valueManager.removeListener(this.props.path, this.props.onValueChange);
    },
    updateValue(val){
      this.props.valueManager.update(this.props.path, val);
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
        this.props.valueManager.update(this.props.path, this.valueFromEvt(e));
    },
    handleValidate(e){
        // this.props.onValidate(this.valueFromEvt(e), this.state.value, this.props.name, this.props.path);
        this.props.onValidate();
    }

};

module.exports = FieldMixin;