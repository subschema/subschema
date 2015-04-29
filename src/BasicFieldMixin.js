var BasicFieldMixin = {
    componentWillMount(){
        if (!this.props.valueManager){
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
        if (!this.props.valueManager){
            return
        }
        this.props.valueManager.removeListener(this.props.path, this.setValue, this);
       // this.props.valueManager.removeListener(this.props.path, this.props.onValueChange);
    },
    getDefaultProps(){
        return {
            onValueChange(value)
            {
                return this.valueManager.update(this.path, value);
            }
        }
    }
};

module.exports = BasicFieldMixin;