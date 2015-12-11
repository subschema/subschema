import React, {Component} from 'react';
import {decorators, PropTypes} from 'Subschema';
var {listen} = decorators;

function clzName(name, active) {
    return (name === active ? 'active' : '');
}
export default class Link extends Component {

    @listen("value", "pathname")
    pathname(pathname) {
        this.setState({pathname})
    }

    render() {
        var {value} = this.props.value

        return <a href={`#/${this.props.value.valu}`}
                  className={this.props.className+' '+clzName(this.props.value.value, this.state.pathname)}>{this.props.value.value}</a>
    }
}