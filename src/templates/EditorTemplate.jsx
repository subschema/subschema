var React = require('../react');
var css = require('../css');
var Content = require('../types/Content.jsx')
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
        return (<div
            className={"form-group field-name " + (error != null ? errorClassName || '' : '') + ' ' +  css.forEditor(this)}>
            <Content content={title} type="label" className="col-sm-2 control-label" htmlFor={name}
                     valueManager={valueManager} loader={loader}/>

            <div className="col-sm-10">
                {children}
                <Content content={error ? error : help} key='error-block' type='p'
                         className={error ?'error-block help-block' : 'help-block'}
                         valueManager={valueManager} loader={loader}/>
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;