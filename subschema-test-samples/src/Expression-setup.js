import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import loaderFactory from 'subschema-loader';

class Anchor extends Component {

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
const loader = loaderFactory();
loader.addType({Anchor});
