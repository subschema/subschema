var {PropTypes, decorators, types} = Subschema;
var {provide} = decorators;
var {type} = provide;
var {Select} = types;

//copy propTypes (don't ref it will break Select)
var {options, ...copyPropTypes} = Select.propTypes;
copyPropTypes.options = PropTypes.listener;

@type
class SelectListen extends React.Component {
    static propTypes = copyPropTypes;

    render() {
        return <Select {...this.props}/>
    }
}
