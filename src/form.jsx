var React = require('react');
var NestedMixin = require('./NestedMixin.jsx');
var loader = require('./loader.jsx');
var Form = React.createClass({
    displayName: 'Form',
    mixins: [NestedMixin],
    getDefaultProps() {
        return {
            template: 'FormTemplate',
            onSubmit(){

            }
        }

    },
    
    handleSubmit(e){
        e && e.preventDefault();
        var errors = this.validate();
        this.props.onSubmit(e, errors, this.getValue());
    },

    render() {

        var {schema, subSchema,  fields, submitButton,  template, ...props} = this.props;
        schema = schema || subSchema;
        schema = this.normalizeSchema(schema);
        this.schema = schema.schema ? schema : {schema: schema, fields: fields};
        var sb = submitButton || this.schema.submitButton;
        var Template = loader.loadTemplate(template);
        return <Template onValidate={this.handleValidate} onSubmit={this.props.onSubmit} schema={this.schema} value={this.state.value}>
            {this.schema && this.schema.schema ? this.renderSchema(this) : null}
            {sb ?
                <button type="submit" className='btn btn-primary' dangerouslySetInnerHTML={{__html: sb}}/> : null}
            {this.props.children}
        </Template>
    }

});
module.exports = Form;