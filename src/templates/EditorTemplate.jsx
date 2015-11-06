"use strict";
var React = require('../React');
var Children = React.Children;
var css = require('../css');
var Content = require('../types/Content.jsx')
var style = require('subschema-styles/EditorTemplate-style');
var {FREEZE_OBJ} = require('../tutils');
var PropTypes = require('../PropTypes');
function childrenValueManager(children, valueManager) {
    var props = {valueManager};
    return Children.map(children, (child)=>React.cloneElement(child, props));
}

var EditorTemplate = React.createClass({
    displayName: 'EditorTemplate',
    contextTypes: {
        valueManager: PropTypes.valueManager
    },
    componentWillMount(){
        this._listen(this.props, FREEZE_OBJ);
    },
    componentWillUnmount(){
        this._errorListener && this._errorListener.remove();
    },
    componentWillReceiveProps(newProps){
        this._listen(newProps, this.props)
    },
    getInitialState(){
        return {};
    },
    _listen(newProps, oldProps){
        if ((newProps.path === oldProps.path )) {
            return;
        }
        this._errorListener && this._errorListener.remove();
        this._errorListener = this.context.valueManager.addErrorListener(newProps.path, this.setError, this, true);
    },

    setError(errors){
        this.setState({
            error: errors && errors[0].message
        });
    },
    render(){
        var {name, title, help, errorClassName, message, fieldClass,  children} = this.props;
        var error = this.state.error;
        if (!title) {
            title = ''
        }

        return (<div
            className={style.group+" " + (error != null ? errorClassName || '' : '') + ' ' +  css.forEditor(this)}>
            <Content content={title} type="label" className={style.label} htmlFor={name}/>

            <div className={title ? style.hasTitle : style.noTitle}>
                {children}
                {help === false ? null : <Content content={error ? error : help} key='error-block' type='p'
                                                  className={error ? style.error : style.help}/>}
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;