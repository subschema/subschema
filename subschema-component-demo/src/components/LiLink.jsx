import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';

export default class LiLink extends Component {

    static propTypes = {
        "pathname": PropTypes.listener,
        "href": PropTypes.expression,
        "search": PropTypes.expression,
        "label": PropTypes.expression,
        "onChange": PropTypes.valueEvent
    };

    static defaultProps = {
        "pathname": "pathname",
        "label": "{.}",
        "href": "",
        "search": "",
        "className": "",
        "activeClass": "active"
    };

    handleClick = (e)=> {
        e && e.preventDefault();
        this.props.onChange(!this.props.value);
    };

    render() {
        const {className, activeClass, value, anchorClass, href, search, label} = this.props;
        return <li className={`${className} ${value ? activeClass : '' }`}>
            <a href={`${href||''}${search || ''}`}
               onClick={this.handleClick}
               className={anchorClass}>{label}</a>
        </li>
    }
}