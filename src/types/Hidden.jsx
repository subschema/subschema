"use strict";
import React, {Component} from 'react';
import {field} from '../decorators';
@field
export default class Hidden extends Component {
    static inputClassName = ' ';
    render() {
        return <input id={this.props.name} name={this.props.name} type="hidden"
                      value={JSON.stringify(this.state.value)}/>
    }
}