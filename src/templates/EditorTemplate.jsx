"use strict";
import React, {Component} from 'react';
import style from 'subschema-styles/EditorTemplate-style';
import PropTypes from '../PropTypes';
import css from '../css';
import Content from '../types/Content.jsx';
import listen from '../decorators/listen';

export default class EditorTemplate extends Component {

    @listen('error')
    setError(errors){
        this.setState({
            error: errors && errors[0].message
        });
    }
    render(){
        var {name, title, help, errorClassName, message, fieldClass,  children} = this.props;
        var error = this.state.error;
        if (!title) {
            title = ''
        }

        return (<div
            className={style.group+" " + (error != null ? errorClassName || '' : '') + ' ' +  css.forEditor(this)}>
            <Content content={title} type="label" className={style.label} htmlFor={name}/>

            <div className={title ? style.hasTitle : style.noTitle}>
                {children}
                {help === false ? null : <Content content={error ? error : help} key='error-block' type='p'
                                                  className={error ? style.error : style.help}/>}
            </div>
        </div>);
    }
}