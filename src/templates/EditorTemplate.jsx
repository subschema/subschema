var React = require('react');
var EditorTemplate = React.createClass({
    displayName:'EditorTemplate',
    render(){
        var {name, title, help, errorClassName, message, fieldClass, children} = this.props;
        return (<div
            className={"form-group field-name " + (message != null ? errorClassName : '') + ' ' +  fieldClass}>
            {title ? <label className="col-sm-2 control-label" htmlFor={name}>{title}</label> : null}

            <div className="col-sm-10">
                {children}
                <p className="help-block">{message || help}</p>
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;