"use strict";
import React, {Component} from 'react';

export default class Highlight extends Component {
    render() {
        var lang = this.props.lang;
        if (lang === 'html') lang = 'xml';
       return <pre languages={[ lang]} className={lang}>
            {this.props.children}
        </pre>
    }
}