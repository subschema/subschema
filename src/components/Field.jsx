"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class Field extends Component {

    static propTypes = {
        path: PropTypes.path.isRequired,
        field: PropTypes.field
    };

    render() {
        const {type, path, field} =this.props;
        const {Template, Type, validators, ...rest} = field;

        return (Template ? <Template path={path} {...rest} >
            <Type path={path} onBlur={validators} {...rest}/>
        </Template> : <Type path={this.props.path} {...rest}/>);

    }
}
