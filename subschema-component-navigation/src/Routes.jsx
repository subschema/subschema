import React from 'react';
import PropTypes from 'subschema-prop-types';
import route from '@funjs/route-parser/dist/index.umd';
import {location as locationPropType} from './PropTypes';

function matcher(obj) {
    const arr = Object.keys(obj).map(function makeMatch(key) {
        return {match: route(key).match, component: obj[key]};
    });

    return function (path, resolve) {
        for (const cur of arr) {
            const props = cur.match(path);
            if (props) {
                if (!cur.Component) {
                    cur.Component = resolve(cur.component)
                }
                return [props, cur.Component];
            }
        }
        return null;
    }
}

export default class Routes extends React.Component {
    static template = false;

    static matcher = matcher;

    static contextTypes = {
        loader: PropTypes.loader.isRequired,
        injector: PropTypes.injector
    };

    static propTypes = {
        notFound: PropTypes.type,
        routes: PropTypes.object,
        location: locationPropType
    };

    componentWillMount() {
        this.matches = Routes.matcher(this.props.routes);
    }

    componentWillRecieveProp(props) {
        if (props.routes != this.props.routes) {
            this.matches = Routes.matcher(props);
        }
    }

    static defaultProps = {
        notFound: "NotFound"
    };
    resolve = (component) => {
        if (typeof component == 'string') {
            const Component = this.context.loader.loadType(component);
            if (Component) {
                return this.context.injector.inject(Component);
            }
        }
        return component;
    };

    render() {
        const {pathname} = this.props.location;
        let to = this.matches(pathname, this.resolve);
        if (to) {
            const [props, Component] = to;
            if (Component)
                return <Component {...props}/>
        }
        const Component = this.resolve(this.props.notFound);
        return <Component location={this.props.location}/>

    }
}