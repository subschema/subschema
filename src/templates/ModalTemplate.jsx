"use strict";
import React, {Component, Children} from 'react';
import Buttons from './ButtonsTemplate.jsx';
import Content from '../types/Content.jsx'
import styles from 'subschema-styles/ModalTemplate-style';
import ValueManager from '../ValueManager';
import Editor from '../Editor';
import PropTypes from '../PropTypes';
import NewChildContext from '../NewChildContext.jsx';
var ModalTemplate = React.createClass({

    contextTypes: {
        valueManager: PropTypes.valueManager,
        parentValueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    },
    propTypes: {
        onCommit: PropTypes.event,

    },
    getDefaultProps(){
        return {
            onCommit(){

            }
        }
    },
    handleClose(e){
        e && e.preventDefault();
        this.context.parentValueManager.update(this.props.dismiss, false);
    },
    handleBtnClose(e, action){
        switch (action) {
            case 'submit':
            {
                this.props.onSubmit(e);
            }
            case 'close':
            case 'cancel':
                this.handleClose(e);
                break;
        }

    },
    renderFooter(buttons){
        if (!buttons) return null;
        return <div className={styles.footer}><Buttons buttons={buttons} onButtonClick={this.handleBtnClose}/></div>
    },
    render(){
        var {title, buttons, path,value, children, ...rest} = this.props;
        return <div className={`${styles.namespace} ${styles.overlay}`} style={{display:'block'}}>
            <div className={styles.backdrop}></div>
            <div className={styles.dialog} role="document" style={{zIndex:2000}}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <button onClick={this.handleClose} className={styles.close} name={this.props.dismiss}
                                value={value}
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        {title ? <Content type='h4'  {...rest} content={title}/> : null }
                    </div>
                    <div className={styles.body}>
                        {children}
                    </div>
                    {this.renderFooter(buttons)}
                </div>
            </div>
        </div>
    }
});

//module.exports = ModalTemplate;
var ModalTemplateWrapper = React.createClass({
    contextTypes: {
        loader: PropTypes.loader,
        valueManager: PropTypes.valueManager
    },
    render(){
        var {...context} = this.context;
        var {conditional, ...props} = this.props;
        return <NewChildContext {...context} path={props.path}>
            <ModalTemplate {...props}/>
        </NewChildContext>
    }
});

module.exports = ModalTemplateWrapper;