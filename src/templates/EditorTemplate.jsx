var React = require('../react');
var css = require('../css');
var EditorTemplate = React.createClass({
    displayName: 'EditorTemplate',
    componentWillMount(){
        this.props.valueManager.addErrorListener(this.props.path, this.setError, this, true);
    },
    componentWillUnmount(){
        this.props.valueManager.removeErrorListener(this.props.path, this.setError);
    },
    setError(errors){
        this.setState({
            error: errors && errors[0].message
        });
    },
    render(){
        var {name, title, help, errorClassName, message, fieldClass, children} = this.props;
        var error = this.state.error;
        return (<div
            className={"form-group field-name " + (error != null ? errorClassName || '' : '') + ' ' +  css.forEditor(this)}>
            {title ? <label className="col-sm-2 control-label" htmlFor={name}><span dangerouslySetInnerHTML={{__html:title}}/></label> : null}

            <div className={title ? "col-sm-10" : "col-sm-12"}>
                {children}
                <p className="help-block" ref="help">{error || help}</p>
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;
