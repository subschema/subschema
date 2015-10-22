"use strict";
var React = require('../react');

var Content = require('../types/Content.jsx')
var ModalTemplate = React.createClass({
    handleClose(e){
        e && e.preventDefault();
        this.props.valueManager.update(this.props.dismiss, false);
    },
    render(){
        var {title, path,value, children, ...rest} = this.props;
        return <div className="modal" style={{display:'block'}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className='modal-header'>
                        <button onClick={this.handleClose} className='modal-close' name={path} value={value}
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        {this.props.title ?
                            <Content type='h4' className='modal-header' {...rest} content={title}/> : null }
                    </div>
                    <div className='modal-body clearfix'>
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={this.handleClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
});

module.exports = ModalTemplate;