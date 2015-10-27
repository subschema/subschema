var React = require('../react');
var Editor = require('../Editor');
var CreateItemMixin = require('../types/CreateItemMixin');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Content = require('../types/Content.jsx');
var style = require('../styles/CollectionCreateTemplate-style');
var CollectionCreateTemplate = React.createClass({
    mixins: [CreateItemMixin],
    render(){
        var title = this.props.title;
        if (typeof title === 'string') {
            title = {
                type: 'h3',
                content: title,
                className: style.panelTitle
            }
        }
        return (<div className={style.panel}>


            <Content content={title} type='div' className={style.panelHeading} valueManager={this.props.valueManager}
                     loader={this.props.loader}/>

            <div className={style.panelBody}>
                <div className={style.group}>
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

