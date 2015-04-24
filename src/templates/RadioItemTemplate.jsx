var React = require('../react');
var RadioItemTemplate = React.createClass({

    render(){
        var {label, labelHTML, id} = this.props;


        label = labelHTML ? <span dangerouslySetInnerHTML={{__html:labelHTML}}/> : label;

        return (<div className="radio">
            <label>
                {this.props.children}
                {label}
            </label>
        </div>);
    }
});
module.exports = RadioItemTemplate