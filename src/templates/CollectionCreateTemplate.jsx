"use strict";
import React, {Component} from 'react';
import Editor from '../components/Editor.jsx';
import Content from '../types/Content.jsx';
import style from 'subschema-styles/CollectionCreateTemplate-style';

export default class CollectionCreateTemplate extends Component {
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

