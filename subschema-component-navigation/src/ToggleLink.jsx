import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import qs from 'querystring';
function parse(value) {
    return (value === 'true');
}
export default class ToggleLink extends Component {

    static propTypes = {
        "pathname": PropTypes.value,
        "query"   : PropTypes.value
    };

    static defaultProps = {
        "label"      : "{.}",
        "name"       : "",
        "search"     : "",
        "className"  : "",
        "activeClass": "active",
        "pathname"   : "@pathname",
        "query"      : "@query"
    };


    render() {
        const {
                  className, activeClass, value, anchorClass,
                  pathname, name, query = {}, label
              } = this.props;

        const { ...copy } = query == '' ? {} : query;
        const active      = (name in copy);
        if (active) {
            delete copy[name];
        } else {
            copy[name] = void(0);
        }
        const search = qs.stringify(copy).replace(/=(&)|(=$)|=true/g, '$1');

        return <li className={`${className} ${active ? activeClass
            : '' }`}>
            <a href={`#${pathname}${search ? `?${search}` : ''}`}
               className={anchorClass}>{label}</a>
        </li>
    }
}
