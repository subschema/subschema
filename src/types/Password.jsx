"use strict";

import React, {Component} from 'react';

export default class Password extends Component {
    static defaultProps = {
        type: 'password'
    };

    render() {
        return <input {...this.props}/>
    }

}