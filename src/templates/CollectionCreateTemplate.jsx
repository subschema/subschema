var React = require('../react');
var Editor = require('../Editor');
var CreateItemMixin = require('../types/CreateItemMixin');
var ReactCSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;
require('../styles/transitions.less');
var CollectionCreateTemplate = React.createClass({
    mixins: [CreateItemMixin],
    render(){
        return (<div className="panel panel-default">

            <div className="panel-heading">
                <h3 className={ 'panel-title clearfix '}>
                    {this.props.title}
                </h3>
            </div>
            <div className="panel-body">
                <div className="form-group">
                    <Editor ref="itemEditor" field={this.props.field} value={this.props.value}
                            valueManager={this.valueManager}
                            name={this.props.name}
                            pid={this.props.editPid}
                            form={null}/>
                </div>
            </div>
        </div>);
    }
});
module.exports = CollectionCreateTemplate;

