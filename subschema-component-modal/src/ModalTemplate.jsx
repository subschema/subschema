import React from 'react';
import PropTypes from 'subschema-prop-types';
import RenderContent from 'subschema-core/lib/RenderContent';
import warning from 'subschema-utils/lib/warning';
import StashableMixin from 'subschema-core/lib/StashableMixin';


export default class ModalTemplate extends StashableMixin {
    static propTypes = {
        ...StashableMixin.propTypes,
        style          : PropTypes.style,
        title          : PropTypes.content,
        //buttons will get an object describing buttons, not a rendered  node
        buttons        : PropTypes.buttons,
        path           : PropTypes.path,
        dismiss        : PropTypes.valueEvent,
        buttonsTemplate: PropTypes.template,
        legend         : PropTypes.content,
        error          : PropTypes.error
    };

    static defaultProps = {
        ...StashableMixin.defaultProps,
        buttonsTemplate: 'ButtonsTemplate',
        buttons        : {
            buttonsClass: 'pull-right btn-group',
            buttons     : [
                {
                    label    : "Cancel",
                    action   : 'cancel',
                    className: 'btn'
                },
                {
                    label    : "Save",
                    action   : 'submit',
                    primary  : true,
                    className: 'btn btn-primary'
                }
            ]
        },
        dismiss(){
            warning(false, 'no dismiss path given to modal');
        }
    };

    handleBtnClose    = (e) => {
        e && e.preventDefault();
        this.unstash();
        this.props.dismiss();
    };
    handleButtonClick = (e, action, btn) => {
        if (!this.props.buttons) {
            return;
        }
        const { onButtonClick } = this.props.buttons;
        switch (action) {
            case 'cancel':
            case 'close':
                this.handleBtnClose(e);
                return false;
            default: {
                const errors = this.validate();
                if (errors) {
                    onButtonClick && onButtonClick(e, action, btn);

                    return;
                }
                this.clearStash();
                this.props.dismiss();
                onButtonClick && onButtonClick(e, action, btn);

            }
        }
    };

    renderFooter(buttons) {
        if (buttons == false || buttons == null) {
            return null;
        }
        const {
                  template = this.props.buttonsTemplate,
                  ...rest
              }                      = buttons;
        const { Template, ...trest } = template;
        return <div className={this.props.footerClass}>
            <Template {...trest} {...rest}
                      onButtonClick={this.handleButtonClick}/></div>
    }

    render() {
        const { title, legend, buttons, path, value, bodyClass, headerClass, closeClass, contentClass, backdropClass, dialogClass, namespaceClass, overlayClass, children, ...rest } = this.props;

        return (<div className={`${namespaceClass} ${overlayClass}`}
                     style={{ display: 'block' }}>
            <div className={backdropClass}></div>
            <div className={dialogClass} role="document"
                 style={{ zIndex: 2000 }}>
                <div className={contentClass}>
                    <div className={headerClass}>
                        <button onClick={this.handleBtnClose}
                                className={closeClass}
                                name={this.props.path + '@dismiss'}
                                value={value}
                                aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                        <RenderContent type='h4' content={title || legend}/>
                    </div>
                    <div className={bodyClass}>
                        {children}
                    </div>
                    {this.renderFooter(buttons)}
                </div>
            </div>
        </div>);
    }
}
