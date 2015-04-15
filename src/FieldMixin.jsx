var React = require('react');
var FieldMixin = {
    getDefaultProps() {
        return {
            title: '',
            name: '',
            placeholder: '',
            dataType: this.dataType,
            editorClass: '',
            onValueChange() {
            },
            onValidate(){
            }
        }

    },
    componentWillMount(){
        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);
    },
    componentWillUnMount(){
        this.props.valueManager.removeListener(this.props.path, this.setValue, this);
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