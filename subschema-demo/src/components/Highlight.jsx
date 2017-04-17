"use strict";
import React  from 'react';

export default class Highlight extends React.Component {
    render() {
        var lang = this.props.lang;
        if (lang === 'html') lang = 'xml';
       return <pre languages={[ lang]} className={lang} onClick={this.props.onClick}>
            {this.props.children}
        </pre>
    }
}