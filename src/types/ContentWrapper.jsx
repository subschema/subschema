"use strict";

import React, {Component} from 'react';
import listeners from '../decorators/listeners';
import substitute from './SubstituteMixin';
import {FREEZE_OBJ} from '../tutils';
import PropTypes from '../PropTypes';

function keyToSetState(obj, key) {
    obj[key] = 'handleValChange';
    return obj;
}

export default class ContentWrapper extends Component {
    static defaultProps = {
        type: 'span',
        content: ''
    };

    static propTypes = {
        content: PropTypes.string
    };

    static contextTypes = {
        loader: PropTypes.loader
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(props) {
        if (props.content === this.props.content) {
            return;
        }
        this.listen(props);
    }

    @listeners
    listen(props) {
        var listenTo = (this._fmt = substitute((props || this.props).content)).listen.reduce(keyToSetState, {});
        return listenTo;
    }

    handleValChange(value, oldValue, path) {
        if (this.state[path] !== value) {
            this.state[path] = value;
            this.forceUpdate();
        }
    }

    currentContent() {
        return this._fmt.format(this.state);
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
        return <Type {...props} key='content' dangerouslySetInnerHTML={{ __html: this.currentContent()}}/>

    }
}