const {PropTypes, types} = Subschema;
const {Select} = types;

class SelectListen extends React.Component {
    static propTypes = {
        ...Select.propTypes,
        options:PropTypes.listener

    };

    render() {
        var value = this.props.value;
        if (value == null && this.props.options) {
            value = this.props.options[0].val;
        }
        return <Select {...this.props} value={value}/>
    }
}

loader.addType('SelectListen', SelectListen);