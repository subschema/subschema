import React, {Component} from 'react';
import { PropTypes} from 'Subschema';
function clzName(name, active) {
    return (name === active ? 'active' : '');
}
import location from '../location';

export default class Link extends Component {

    static propTypes = {
        "pathname": PropTypes.listener,
        "href": PropTypes.expression,
        "search": PropTypes.expression,
        "label": PropTypes.expression,
        "onChange": PropTypes.valueEvent
    }
    static defaultProps = {
        "pathname": "pathname",
        "label": "{.}"
    }
    handleClick = (e)=> {
        e && e.preventDefault();
        this.props.onChange(!this.props.value);
    }

    render() {
        return <a href={this.props.href+this.props.search}
                  onClick={this.handleClick}
                  className={this.props.className+' '+(this.props.value ? 'active' : '')}>{this.props.label}</a>
    }
}