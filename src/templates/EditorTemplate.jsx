var React = require('../react');
var css = require('../css');
<<<<<<< HEAD

require('../styles/form.less')

=======
var Content = require('../types/Content.jsx')
>>>>>>> Making content more flexible with children
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
        var {name, title, help, errorClassName, message, fieldClass, loader, valueManager, children} = this.props;
        var error = this.state.error;
        return (<div className={"form-group field-name " + (error != null ? errorClassName || '' : '') + ' ' +  css.forEditor(this)}>            
            <div className="col-sm-10">
              {title ? <label className="control-label" htmlFor={name}><span dangerouslySetInnerHTML={{__html:title}}/></label> : null}
              <div className="control-content">
                <div className="helpers">
                  <p className="error-block" ref="error">{error}</p>
                  <p className="help-block" ref="help">{help}</p>                  
                </div>                  
                  {children}
              </div>
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;