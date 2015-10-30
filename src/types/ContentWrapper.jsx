"use strict";

var React = require('../react');
var DOM = React.DOM || {};
var ContentWrapper = React.createClass({
    mixins: [require('./SubstituteMixin.js')],
    getDefaultProps(){
        return {
            type: 'span',
            content: ''
        }
    },
    componentWillReceiveProps(props){
        if (props.content === this.props.content) {
            return;
        }
        this.rebuildValue(props.content);
    },
    componentWillMount(){
        this.rebuildValue(this.props.content);
    },
    render(){
        var {type, content, children, context, ...props} = this.props, Type

        if (React.DOM[type]) {
            props.dangerouslySetInnerHTML = {
                __html: this.currentContent()
            };
            return React.createElement(type, props);
        } else if (this.context.loader) {
            Type = this.context.loader.loadType(type);
        }
        return <Type {...props}>
            <span key='content' dangerouslySetInnerHTML={{ __html: this.currentContent()}}/>
            {children}
        </Type>

    }
});

module.exports = ContentWrapper;