import React, { PureComponent } from 'react';

export default class Highlight extends PureComponent {
    render() {
        var lang = this.props.lang;
        if (lang === 'html') {
            lang = 'xml';
        }
        return <pre languages={[lang]} className={lang}
                    onClick={this.props.onClick}>
            {this.props.children}
        </pre>
    }
}
