var React = require('../react');
var ListInput = require('../types/List.jsx');
var Constants = require('../Constants');

var ListTemplate = React.createClass({
    render(){
        return (<div className={Constants.clz(ListInput.inputClassName, this.props.editorClass, 'list-editor')}>
            {this.props.renderAdd}
            <ul className={Constants.clz(ListInput.inputListClassName)}>
                {this.props.children}
            </ul>
        </div>);
    }
});

module.exports = ListTemplate;