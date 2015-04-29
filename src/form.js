var React = require('./react');
var NestedMixin = require('./NestedMixin');
var loader = require('./loader');

var ValueManager = require('./ValueManager');
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
        var vm = this.props.valueManager;
        if (vm.onSubmit(e, vm.getErrors(), vm.getValue(), this.props.path) !== false) {
            this.props.onSubmit(e, vm.getErrors(), vm.getValue());
        }
    },
    setErrors(errors){
        this.props.valueManager.setErrors(errors);
    },
    render() {

        var {schema, subSchema,  fields, submitButton,  template, ...props} = this.props;
        schema = schema || subSchema;
        schema = this.normalizeSchema(schema);
        this.schema = schema.schema ? schema : {schema: schema, fields: fields};
        var sb = submitButton || this.schema.submitButton;
        var Template = loader.loadTemplate(template);
        return <Template onValidate={this.handleValidate} onSubmit={this.handleSubmit} schema={this.schema}
                         className={this.props.className}
                         valueManager={this.props.valueManager}
            >
            {this.schema && this.schema.schema ? this.renderSchema(this) : null}
            {sb ?
                <button type="submit" className='btn btn-primary' dangerouslySetInnerHTML={{__html: sb}}/> : null}
            {this.props.children}
        </Template>
    }

});
module.exports = Form;