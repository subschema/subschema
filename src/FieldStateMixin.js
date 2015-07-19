var FieldStateMixin = {
    getInitialState(){
        return {
            value: this.props.value
        }
    },
    setValue(value){
        this.setState({value});
    },
    getValue(){
        return this.state.value;
    }
};
module.exports = FieldStateMixin;