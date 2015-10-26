var React = require('../react');
var css = require('../css');
var Content = require('../types/Content.jsx')
var style = require('./EditorTemplate-style');
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
        if (!title){ title = ''}

        return (<div
            className={style.group+" " + (error != null ? errorClassName || '' : '') + ' ' +  css.forEditor(this)}>
            <Content content={title} type="label" className={style.label} htmlFor={name}
                     valueManager={valueManager} loader={loader}/>

            <div className={title ? "col-sm-10" : "col-sm-12"}>
                {children}
                <Content content={error ? error : help} key='error-block' type='p'
                         className={error ? style.error : style.help}
                         valueManager={valueManager} loader={loader}/>
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;