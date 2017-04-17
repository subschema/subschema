"use strict";
import React, {Component, Children} from "react";
import PropTypes from "../PropTypes";
import cloneDeep from "lodash/cloneDeep";
import RenderContent from "../components/RenderContent";
import RenderTemplate from "../components/RenderTemplate";


export default class ModalTemplate extends Component {
    static defaultBtns = {
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
    };

    static propTypes = {
        style: PropTypes.style,
        title: PropTypes.content,
        buttons: PropTypes.buttons,
        path: PropTypes.path,
        value: PropTypes.value,
        onChange: PropTypes.valueEvent,
        dismiss: PropTypes.valueEvent,
        buttonsTemplate: PropTypes.template,
        legend: PropTypes.content,
        error: PropTypes.error

    };

    static defaultProps = {
        buttonsTemplate: 'ButtonsTemplate',
        onCancel(){
        }
    };


    handleCancel() {
        this.props.onChange(this.value);
        this.props.dismiss();
    }

    constructor(props, ...rest) {
        super(props, ...rest);
        this.value = !props.value ? null : cloneDeep(props.value);
    }


    handleClose = (e)=> {
        e && e.preventDefault();
        this.props.dismiss();
    };
    handleBtnClose = (e, action) => {
        switch (action) {
            case 'submit':
            {
                if (this.props.error) {
                    break;
                }
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
        if (buttons == false) return null;
        if (buttons == null)
            buttons = <RenderTemplate template={this.props.buttonsTemplate} {...this.constructor.defaultBtns}
            />
        return <div
            className={this.props.footerClass}>{React.cloneElement(buttons, {onButtonClick: this.handleBtnClose})}</div>
    }

    render() {
        const {title, legend, buttons, path, value, bodyClass, headerClass, closeClass, contentClass, backdropClass, dialogClass, namespaceClass, overlayClass, children, ...rest} = this.props;

        return <div className={`${namespaceClass} ${overlayClass}`} style={{display:'block'}}>
            <div className={backdropClass}></div>
            <div className={dialogClass} role="document" style={{zIndex:2000}}>
                <div className={contentClass}>
                    <div className={headerClass}>
                        <button onClick={this.handleClose} className={closeClass} name={this.props.path+'@dismiss'}
                                value={value}
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <RenderContent type='h4' content={title || legend}/>
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
