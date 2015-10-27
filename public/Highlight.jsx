var React = require('react');
var HighlightExt = React.createClass({
    render(){
        var lang = this.props.lang;
        if (lang === 'html') lang = 'xml';

        return <div languages={[ lang]} className={lang}>
            {this.props.children}
        </div>
    }
});

module.exports = HighlightExt;