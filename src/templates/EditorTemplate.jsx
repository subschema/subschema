var React = require('../react');
var css = require('../css');

require('../styles/form.less')

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

            <div className="col-sm-10">
              {title ? <label className="control-label" htmlFor={name}><span dangerouslySetInnerHTML={{__html:title}}/></label> : null}
              <div className="control-content">
                  <p className="help-block" ref="help">{help}</p>
                  {children}                
                  <p className="error-block" ref="error">{error}</p>
              </div>
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;