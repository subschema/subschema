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
        component: PropTypes.listener,
        example: PropTypes.listener,
    }
    static defaultProps = {
        useData: "useData",
        useError: "useError",
        conf: ".conf",
        example: '.example',
        component: '.component'
    };

    render() {
        var {component, ...rest}=this.props;
        if (component == null) return null;
        var Component = this.context.loader.loadType(component);
        return <Component {...rest}/>

    }
}