var React = require('react');
var SchemaBuilder = require('../builder/SchemaBuilder.jsx');
var SchemaDoc = React.createClass({
    render(){
        return (<div>
            <h3>Schema</h3>
            <fieldset>
                <legend></legend>
                <p className="lead">
                    The subschema schema was borrowed from backbone-forms. It seems reasonable enough, though I don't
                    garuntee compat
                </p>

                <div className="panel">
                    <div className="panel-heading">
                        <h3>Writing Schema</h3>
                    </div>
                    <div className="panel-body">
                        I was going to write a doc to describe how to write schema, but instead here is a little
                        schema builder to do it for me.
                        <SchemaBuilder/>
                    </div>
                </div>

            </fieldset>
        </div>);
    }
});
module.export = SchemaDoc;