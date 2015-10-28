"use strict";
var React = require('../react');
var Children = React.Children;
var Buttons = require('./ButtonsTemplate.jsx');
var Content = require('../types/Content.jsx')
var styles = require('../styles/ModalTemplate-style');
var ValueManager = require('../ValueManager');
var Editor = require('../Editor');
var ModalTemplate = React.createClass({
    componentWillMount(){
        var {...value} = this.props.valueManager.path(this.props.path);
        this.valueManager = ValueManager({
            [this.props.path]: value
        }, this.props.valueManager.getErrors());
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
    renderFooter(buttons){
        if (!buttons) return null;
        return <div className={styles.footer}><Buttons buttons={buttons} onClick={this.handleBtnClose}/></div>
    },
    render(){
        var {title, buttons, path,value, children, ...rest} = this.props;
        var cloneProps = {
            valueManager: this.valueManager
        }
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
                        {Children.map(children, (element)=>React.cloneElement(element, cloneProps))}
                    </div>
                    {this.renderFooter(buttons)}
                </div>
            </div>
        </div>
    }
});

module.exports = ModalTemplate;