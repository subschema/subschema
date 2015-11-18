"use strict";

var React = require('../React');
var SubstituteMixin = require('./SubstituteMixin.js');
import lifecycle from '../decorators/lifecycle';
import listeners from '../decorators/listeners';
import substitute from './SubstituteMixin';
import {FREEZE_OBJ} from '../tutils';


export default class ContentWrapper extends React.Component {
    static defaultProps = {
        type: 'span',
        content: ''
    }

    componentWillReceiveProps(props) {
        if (props.content === this.props.content) {
            return;
        }
        this.listen(props.content);
    }

    @listeners
    listen(content) {
        content = content || this.props.content;
        var {listen} = this._fmt = substitute(content);
        var obj = {};

        listen.forEach(function keyToSetState(key) {
            obj[key] = (value)=>this.setState({[key]: value});
        }, this);

        return obj;
    }

    currentContent() {
        return this._fmt.format(this.state || FREEZE_OBJ);
    }

    render() {
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
}