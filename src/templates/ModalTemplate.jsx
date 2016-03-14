"use strict";
import React, {Component, Children} from 'react';
import Buttons from './ButtonsTemplate.jsx';
import ValueManager from '../ValueManager';
import PropTypes from '../PropTypes';
import NewChildContext from '../components/NewChildContext.jsx';
import cloneDeep from 'lodash/lang/cloneDeep';
import RenderContent from '../components/RenderContent.jsx';
import RenderTemplate from '../components/RenderTemplate.jsx';

export default class ModalTemplate extends Component {

    static propTypes = {
        style: PropTypes.style,
        title: PropTypes.content,
        buttons: PropTypes.buttons,
        path: PropTypes.path,
        value: PropTypes.value,
        onChange: PropTypes.valueEvent,
        dismiss: PropTypes.valueEvent,
        buttonsTemplate: PropTypes.template,

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
        if (!buttons.buttons) {
            buttons = {
                buttons
            };
        }
        return <RenderTemplate template={this.props.buttonsTemplate} onButtonClick={this.handleBtnClose} {...buttons}/>
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
                        <RenderContent type='h4' content={title}/>
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