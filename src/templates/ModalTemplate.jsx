"use strict";
var React = require('../react');

var Buttons = require('./ButtonsTemplate.jsx');
var Content = require('../types/Content.jsx')
var styles = require('../styles/ModalTemplate-style');
var ModalTemplate = React.createClass({
    handleClose(e){
        e && e.preventDefault();
        this.props.valueManager.update(this.props.dismiss, false);
    },
    handleBtnClose(e, action){
        if (action === 'close') {
            this.handleClose(e);
        }
    },
    render(){
        var {title, buttons, path,value, children, ...rest} = this.props;
        var className = `modal ${styles.overlay}`;
        return <div className={className} style={{display:'block'}}>
            <div className="modal-backdrop fade in"></div>
            <div className="modal-dialog" role="document" style={{zIndex:2000}}>
                <div className="modal-content">
                    <div className='modal-header'>
                        <button onClick={this.handleClose} className='close' name={this.props.dismiss} value={value}
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        {title ? <Content type='h4'  {...rest} content={title}/> : null }
                    </div>
                    <div className='modal-body clearfix'>
                        {children}
                    </div>
                    <div className="modal-footer">
                        { buttons ? <Buttons buttons={buttons} onClick={this.handleBtnClose}/> : null }
                    </div>
                </div>
            </div>
        </div>
    }
});

module.exports = ModalTemplate;