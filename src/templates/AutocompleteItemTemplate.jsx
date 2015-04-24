var React = require('../react');
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
    /*shouldComponentUpdate() {
     // Events never change, so return false always.
     return false;
     },*/
    handleClick (e) {
        e && e.preventDefault();
        this.props.onSelect(this.props.data);
    },
    render () {
        var {data, focus, value, processor} = this.props;
        var cls = 'addr_itm list-group-item ' + (focus ? 'focused' : '');
        var html = processor.format(data, value, true);
        return html == null ? null :
            <li ref="item" className={cls} onClick={this.handleClick} dangerouslySetInnerHTML={{__html: html}}/>
    }
});
module.exports = AutocompleteItemTemplate;