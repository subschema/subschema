"use strict";
var React = require('../react');
var Children = React.Children;
var Buttons = require('./ButtonsTemplate.jsx');
var Content = require('../types/Content.jsx')
var styles = require('../styles/ModalTemplate-style');
var ValueManager = require('../ValueManager');
var ModalTemplate = React.createClass({
    componentWillMount(){
        var {...value} = this.props.valueManager.path(this.props.path);
        var copy = {
            [this.props.path]: value
        }
        this.valueManager = ValueManager(copy, this.props.valueManager.getErrors());
    },
    handleClose(e){
        e && e.preventDefault();
        this.props.valueManager.update(this.props.dismiss, false);
    },
    handleBtnClose(e, action){
        switch (action) {
            case 'submit':
            {
                this.props.valueManager.update(this.props.path, this.valueManager.path(this.props.path));
            }
            case 'close':
            case 'cancel':
                this.handleClose(e);
                break;
        }

    },
    render(){
        var {title, buttons, path,value, children, ...rest} = this.props;
        var cloneProps = {
            valueManager: this.valueManager
        }
        return <div className={`modal ${styles.overlay}`} style={{display:'block'}}>
            <div className="modal-backdrop fade in"></div>
            <div className="modal-dialog" role="document" style={{zIndex:2000}}>
                <div className="modal-content">
                    <div className='modal-header'>
                        <button onClick={this.handleClose} className='close' name={this.props.dismiss} value={value}
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        {title ? <Content type='h4'  {...rest} content={title}/> : null }
                    </div>
                    <div className='modal-body clearfix'>
                        {Children.map(children, (element)=>React.cloneElement(element, cloneProps))}
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