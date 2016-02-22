"use strict";
import React, {Component, Children} from 'react';
import Buttons from './ButtonsTemplate.jsx';
import Content from '../types/Content.jsx'
import styles from 'subschema-styles/ModalTemplate-style';
import ValueManager from '../ValueManager';
import PropTypes from '../PropTypes';
import NewChildContext from '../components/NewChildContext.jsx';
import cloneDeep from 'lodash/lang/cloneDeep';

export default class ModalTemplate extends Component {

    static propTypes = {
        title: PropTypes.node,
        buttons: PropTypes.buttons,
        path: PropTypes.path,
        value: PropTypes.value,
        onChange: PropTypes.valueEvent,
        ModalTemplate: PropTypes.injectClass,
        dismiss: PropTypes.valueEvent,
        buttonsTemplate: PropTypes.template
    };

    static defaultProps = {
        buttonsTemplate: 'ButtonsTemplate',
        onCancel(){
        },
        buttons: {
            buttonsClass: 'pull-right btn-group',
            buttons: [
                {
                    label: "Cancel",
                    action: 'cancel',
                    className: 'btn'
                },
                {
                    label: "Save",
                    action: 'submit',
                    className: 'btn btn-primary'
                }
            ]
        }
    };


    handleCancel() {
        this.props.onChange(this.value);
        this.props.dismiss();
    }

    constructor(props, ...rest) {
        super(props, ...rest);
        this.value = cloneDeep(props.value);
    }

    renderButtons(buttons) {
        if (!buttons) {
            return null;
        }
        const ButtonsTemplate = this.props.buttonsTemplate;
        if (!buttons.buttons) {
            buttons = {
                buttons
            };
        }
        return <ButtonsTemplate onButtonClick={this.handleBtnClose} {...buttons}/>
    }

    handleClose = (e)=> {
        e && e.preventDefault();
        this.props.dismiss();
    };
    handleBtnClose = (e, action) => {
        switch (action) {
            case 'submit':
            {
                this.props.dismiss();
                break;
            }
            case 'close':
            case 'cancel':
                this.props.onChange(this.value);
                this.handleClose(e);
                break;
        }

    };

    renderFooter(buttons) {
        if (!buttons) return null;
        return <div className={styles.footer}>{this.renderButtons(buttons)}</div>
    }

    render() {
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
}