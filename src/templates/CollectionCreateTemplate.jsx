"use strict";
import React, {Component} from 'react';
import Content from '../types/Content.jsx';
import PropTypes from '../PropTypes';

export default class CollectionCreateTemplate extends Component {
    static propType = {
        title: PropTypes.node,
        style: PropTypes.style
    };

    render() {
        var title = this.props.title;
        if (typeof title === 'string') {
            title = {
                type: 'h3',
                content: title,
                className: this.props.panelTitleClass
            }
        }
        return (<div className={this.props.panelClass}>
            <Content content={title} type='div' className={this.props.panelHeadingClass}/>
            <div className={this.props.panelBodyClass}>
                <div className={this.props.groupClass}>
                    {this.props.children}
                </div>
            </div>
        </div>);
    }
};

