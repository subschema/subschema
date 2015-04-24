var FieldMixin = {
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
    }
};

module.exports = FieldMixin;