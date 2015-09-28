var React = require('../react');
var Editor = require('../Editor');
var CreateItemMixin = require('../types/CreateItemMixin');
var ReactCSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;
var Content = require('../types/Content.jsx');
require('../styles/transitions.less');
var CollectionCreateTemplate = React.createClass({
    mixins: [CreateItemMixin],
    render(){
        var title = this.props.title;
        if (typeof title === 'string') {
            title = {
                type: 'h3',
                content: title,
                className: 'panel-title clearfix'
            }
        }
        return (<div className="panel panel-default">


            <Content content={title} type='div' className='panel-heading' valueManager={this.props.valueManager}
                     loader={this.props.loader}/>

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

