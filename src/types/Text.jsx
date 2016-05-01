"use strict";

import React, {Component} from "react";

export default class TextInput extends Component {

    static defaultProps = {
        type: 'text',
        value: ''
    };


    static injectedProps = {
        value: "."
    };

    render() {
        return <input {...this.props}
        />
    }
}

