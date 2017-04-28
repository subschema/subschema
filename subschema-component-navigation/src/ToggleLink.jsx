import React, {Component} from 'react';
import NavigationTypes from './PropTypes';
import qs from 'querystring';
function parse(value) {
    return (value === 'true');
}
export default class ToggleLink extends Component {

    static propTypes = {
        "location": NavigationTypes.location,
        "query": NavigationTypes.query
    };

    static defaultProps = {
        "label": "{.}",
        "name": "",
        "search": "",
        "className": "",
        "activeClass": "active"
    };
    state = {
        current: (this.props.name in this.props.query)
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.query[this.props.name] != nextProps.query[nextProps.name]) {
            this.setState({current: (nextProps.name in nextProps.query)});
        }
    }

    render() {
        const {className, activeClass, value, anchorClass, location: {pathname}, name, query = {}, label} = this.props;
        const {...copy} = query;
        if (this.state.current) {
            delete copy[name];
        } else {
            copy[name] = void(0);
        }
        const search = qs.stringify(copy).replace(/=(&)|(=$)/g, '$1');

        return <li className={`${className} ${this.state.current ? activeClass : '' }`}>
            <a href={`#${pathname}${search ? `?${search}` : ''}`}
               className={anchorClass}>{label}</a>
        </li>
    }
}