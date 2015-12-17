import React, {Component} from 'react';
import Subschema, {PropTypes} from 'Subschema';
import Index from '../Index.jsx';
import Example from './Example.jsx';
export default class Main extends Component {
    static contextTypes = {
        loader: PropTypes.loader.isRequired
    }
    static propTypes = {
        useData: PropTypes.listener,
        useError: PropTypes.listener,
        onChange: PropTypes.valueEvent
    }
    static defaultProps = {
        useData: "useData",
        useError: "useError"
    };

    render() {
        if (this.props.value == null) {
            return null;
        }

        var {component, ...rest} = this.props.value;
        if (component == null) return null;
        var Component = this.context.loader.loadType(component);
        return <Component {...this.props} {...rest}/>

    }
}