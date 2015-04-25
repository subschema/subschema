var React = require('react');
var Highlight = require('./Highlight.jsx');
var Example = React.createClass({
    getInitialState(){
        return {data: this.props.valueManager.getValue(), errors: this.props.valueManager.getErrors()};
    },
    componentWillMount(){
        this.props.valueManager.addListener(null, this.setValue, this, true);
        this.props.valueManager.addErrorListener(null, this.setErrors, this, true);
    },
    componentWillUnmount(){
        this.props.valueManager.removeListener(null, this.setValue);
        this.props.valueManager.removeErrorListener(null, this.setErrors);
    },
    setValue(data){
        this.setState({data});
    },
    setErrors(errors){
        this.setState({errors});
    },
    render(){
        var {data, errors} = this.state;
        var {schema, setupTxt, props} = this.props;
        var propsstr = Object.keys(props || {}).map(function (key) {
            return key + '={' + JSON.stringify(props[key]) + '} ';
        }).join('');
        return <Highlight lang='javascript'>
            <div>var Subschema = require('subschema');</div>
            <div>var Form = Subschema.Form;</div>
            <div>var React = require('react');</div>
            <div>var data = {JSON.stringify(data || {}, null, 2)};</div>
            <div>var errors = {JSON.stringify(errors || {}, null, 2)};</div>
            <div>var schema = {JSON.stringify(schema || {}, null, 2)};</div>
            { setupTxt ? <div>{setupTxt}</div> : null}
            <div>{'React.render(<Form value={data} schema={schema} errors={errors} ' + propsstr + '/>, document.getElementById("content"))'}</div>
        </Highlight>
    }
})

module.exports = Example;