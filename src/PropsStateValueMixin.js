var PropsStateValueMixin = {
    componentWillReceiveProps: function (newProps) {
        this.setState({value: newProps.value});
    }
}

module.exports = PropsStateValueMixin;