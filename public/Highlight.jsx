var Highlight = require('react-highlight/optimized.jsx');
var React = require('react');
var HighlightExt = React.createClass({
    render(){
        var lang = this.props.lang;
        if (lang === 'html') lang = 'xml';
        return <Highlight languages={[ lang]} className={lang}>
            {this.props.children}
        </Highlight>
    }
});

module.exports = HighlightExt;