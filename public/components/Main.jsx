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
        useError: PropTypes.listener
    }
    static defaultProps = {
        useData: "useData",
        useError: "useError"
    };

    render() {
        var value = this.props.value && this.props.value.replace(/^\/#?/, '');
        console.log('main ', value);
        if (/develop/.test(value)) {
            var Develop = this.context.loader.loadTemplate(value);
            if (Develop) {
                return <Develop/>
            }
        } else if (value) {
            return <Example example={value} useData={this.props.useData} useError={this.props.useError}/>
        }
        return <Index/>
    }
}