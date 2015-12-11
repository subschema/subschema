var React = require('react');
var SchemaDoc = React.createClass({
    render(){
        return (<div>
            <h3>Example</h3>
            <fieldset>
                <legend></legend>
                <p className="lead">
                    Simple Example
                </p>

                <div className="panel">
                    <div className="panel-heading">
                        <h3>Simple Example</h3>
                    </div>
                    <div className="panel-body">
                       A very simple example of a project can be found  <a href="https://github.com/jspears/subschema-simple-example">here</a>.
                    </div>
                </div>

            </fieldset>
        </div>);
    }
});
module.exports = SchemaDoc;
