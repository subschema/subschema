import React, {Component} from 'react';
import { PropTypes} from 'Subschema';
function clzName(name, active) {
    return (name === active ? 'active' : '');
}
export default class Button extends Component {

    static propTypes = {
        "pathname": PropTypes.listener,
        "href": PropTypes.expression,
        "label": PropTypes.expression
    }
    static defaultProps = {
        "pathname": "pathname",
        "href": "#/{.}",
        "label": "{.}"
    }

    render() {
        return <a href={this.props.href}
                  className={this.props.className+' '+clzName(value, this.props.pathname)}>{this.props.label}</a>
    }
}