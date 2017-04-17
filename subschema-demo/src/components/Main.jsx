import React, {Component} from 'react';
import Subschema, {PropTypes} from 'Subschema';

export default class Main extends Component {

    static contextTypes = {
        loader: PropTypes.loader.isRequired,
        injector: PropTypes.injector
    };

    static propTypes = {
        useData: PropTypes.listener,
        useError: PropTypes.listener,
        notFound: PropTypes.type,
        value: PropTypes.value
    };

    static defaultProps = {
        useData: "useData",
        useError: "useError",
        notFound: "NotFound",
        value: "pathname"

    };

    render() {

        if (this.props.value == null) {
            return null;
        }
        const {loader} =this.context;
        const pathname = this.props.value;
        console.log('pathname', pathname);
        const type = pathname.replace(/\#?\//, '')

        let value;
        if (/develop/.test(pathname)) {
            value = {component: loader.loadDoc(type.split('/')[1])};
        } else if (type) {
            value = {component: 'Example', example: type, conf: loader.loadSample(type)};
        } else {
            value = {component: 'Index', conf: null};
        }

        let {component, ...rest} = value;
        if (component == null) return null;
        let Component = (typeof component === 'function') ? component : loader.loadType(component);
        if (Component == null) {
            Component = this.props.notFound;
        }
        let IComponent = this.context.injector.inject(Component);
        return <IComponent {...this.props} {...rest}/>

    }
}