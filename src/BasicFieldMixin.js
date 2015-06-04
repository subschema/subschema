var BasicFieldMixin = {
    componentWillMount(){
        if (!this.props.valueManager) {
            return
        }
        if (this.props.value) {
            this.props.valueManager.setValue(this.props.value);
        }
        if (this.props.errors) {
            this.props.valueManager.setErrors(this.props.errors);
        }
        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);
        // this.props.valueManager.addListener(this.props.path, this.props.onValueChange, this);
    },
    componentWillUnmount(){
        if (!this.props.valueManager) {
            return
        }
        this.props.valueManager.removeListener(this.props.path, this.setValue, this);
        // this.props.valueManager.removeListener(this.props.path, this.props.onValueChange);
    },
    getDefaultProps(){
        return {
            handleChange(value){
                if (!this.valueManager) {
                    this.onValueChange(value);
                    return;
                }
                if (this.valueManager.update(this.path, value) !== false) {
                    this.onValueChange(value);
                }
            },
            onValueChange(value)
            {
            }
        }
    }
};

module.exports = BasicFieldMixin;