"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';

/**
 * Hidden does need a template, and does not care about errors.
 * but we will
 */
export default class Hidden extends Component {
    static noTemplate = true;
    //only unnormal is asJSON, which will set the value to json rather than a string
    // so that it can be used to hold hidden state of complex structures.
    static propTypes = {
        asJSON: PropTypes.bool
    };

    static template = false;

    static defaultProps = {
        type: "hidden",
        asJSON: false
    };

    render() {
        var {value,asJSON, ...props} =this.props;
        return <input {...props} value={asJSON ? JSON.stringify(value) : value}/>
    }
}