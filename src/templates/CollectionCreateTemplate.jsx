"use strict";
import React, {Component} from 'react';
import Content from '../types/Content.jsx';
import style from 'subschema-styles/CollectionCreateTemplate-style';
import PropTypes from '../PropTypes';

export default class CollectionCreateTemplate extends Component {
    static propType = {
        title: PropTypes.content
    };

    render() {
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
};

