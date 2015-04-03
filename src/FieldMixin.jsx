var React = require('react');
var PropsStateValueMixin = require('./PropsStateValueMixin.js');
var FieldMixin = {
    getDefaultProps() {
        return {
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
    componentWillRecieveProps(props){
        this.setState({
            value: props.value
        });
    },
    getInitialState(){
        return {
            value: this.props.value
        }
    },
    dataType: 'text',

    getValue(){
        return this.state && this.state.value;
    },
    setValue(value){
        this.setState({
            value: value
        });
    },
    valueFromEvt(e){
        return e.target.value;
    },
    handleChange(e) {
        var value = this.valueFromEvt(e);
        this.props.onValueChange(value, this.state.value, this.props.name, this.props.path);
    },
    handleValidate(e){
        this.props.onValidate(this.valueFromEvt(e), this.state.value, this.props.name, this.props.path);
    }

};

module.exports = FieldMixin;