"use strict";
import React, {Component, Children} from 'react';
import Buttons from './ButtonsTemplate.jsx';
import Content from '../types/Content.jsx'
//import styles from 'subschema-styles/ModalTemplate-style';
import ValueManager from '../ValueManager';
import PropTypes from '../PropTypes';
import NewChildContext from '../components/NewChildContext.jsx';
import cloneDeep from 'lodash/lang/cloneDeep';

export default class ModalTemplate extends Component {

    static propTypes = {
        style: PropTypes.style,
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
        return <div className={this.props.footerClass}>{this.renderButtons(buttons)}</div>
    }

    render() {
        const {title, buttons, path,value,bodyClass, headerClass, closeClass, contentClass, backdropClass, dialogClass, namespaceClass, overlayClass, children, ...rest} = this.props;
        return <div className={`${namespaceClass} ${overlayClass}`} style={{display:'block'}}>
            <div className={backdropClass}></div>
            <div className={dialogClass} role="document" style={{zIndex:2000}}>
                <div className={contentClass}>
                    <div className={headerClass}>
                        <button onClick={this.handleClose} className={closeClass} name={this.props.dismiss}
                                value={value}
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        {title ? <Content type='h4'  {...rest} content={title}/> : null }
                    </div>
                    <div className={bodyClass}>
                        {children}
                    </div>
                    {this.renderFooter(buttons)}
                </div>
            </div>
        </div>
    }
}