const {PropTypes} = Subschema;

class Anchor extends React.Component {

    static propTypes = {
        //by making this propType an expression it will evaluate it dynamically.
        href: PropTypes.expression,
        label: PropTypes.expression
    };

    static defaultProps = {
        href: '#/{.}'
    };

    render() {
        return <a href={this.props.href}>{this.props.label}</a>
    }
}

loader.addType({Anchor});
