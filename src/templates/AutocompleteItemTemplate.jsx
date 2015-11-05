var React = require('../react');
var style = require('subschema-styles/AutocompleteItemTemplate-style');
var AutocompleteItemTemplate = React.createClass({
    getDefaultProps () {
        return {
            data: null,
            value: null,
            focus: false,
            onSelect () {
            }
        }
    },
    handleClick (e) {
        e && e.preventDefault();
        this.props.onSelect(this.props.data);
    },
    render () {
        var {data, focus, value, processor} = this.props;
        var cls = style.item + (focus ? style.focused : '');
        var html = processor.format(data, value, true);
        return html == null ? null :
            <li ref="item" className={cls} onClick={this.handleClick} dangerouslySetInnerHTML={{__html: html}}/>
    }
});
module.exports = AutocompleteItemTemplate;