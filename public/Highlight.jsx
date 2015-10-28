var React = require('react');
var HighlightExt = React.createClass({
    render(){
        var lang = this.props.lang;
        if (lang === 'html') lang = 'xml';

        return <pre languages={[ lang]} className={lang}>
            {this.props.children}
        </pre>
    }
});

module.exports = HighlightExt;