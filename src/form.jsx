var React = require('react');
var NestedMixin = require('./NestedMixin.jsx');
var loader = require('./loader.jsx');
var Form = React.createClass({
    displayName: 'Form',
    mixins: [NestedMixin],
    handleSubmit(e){
        e && e.preventDefault();
        var errors = this.validate();
        this.props.onSubmit && this.props.onSubmit(e, errors, this.getValue());
    },

    render() {

        var {schema, subSchema,  fields, submitButton,  ...props} = this.props;
        this.schema = subSchema ? {schema: subSchema, fields: fields} : schema;
        var sb = submitButton || this.schema.submitButton;
        return <form onValidate={this.handleValidate} onSubmit={this.handleSubmit}>
            {this.schema && this.schema.schema ? this.renderSchema(this) : null}
            {sb ?
                <button type="submit" className='btn btn-primary' dangerouslySetInnerHTML={{__html: sb}}/> : null}

        </form>
    }

});
module.exports = Form;