var React = require('../react');
var Editor = require('../Editor');
var Content = require('../types/Content.jsx');
var style = require('../styles/CollectionCreateTemplate-style');
var CollectionCreateTemplate = React.createClass({
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


            <Content content={title} type='div' className={style.panelHeading}/>

            <div className={style.panelBody}>
                <div className={style.group}>
                    {this.props.children}
                </div>
            </div>
        </div>);
    }
});
module.exports = CollectionCreateTemplate;

