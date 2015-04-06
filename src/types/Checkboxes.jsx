var React = require('react');
var FieldMixin = require('../FieldMixin.jsx');
var tu = require('../tutils');
var loader = require('../loader.jsx');

var Checkboxes = React.createClass({
    getDefaultProps() {
        return {
            title: '',
            name: '',
            placeholder: '',
            dataType: this.dataType,
            template: 'CheckboxesTemplate',
            groupTemplate: 'CheckboxesGroupTemplate',
            onValueChange() {
            },
            onValidate(){
            }
        }

    },
    getInitialState(){
        return {
            value: this.props.value
        }
    },
    getValue() {
        return this.state.value
    },
    setValue(value){
        this.setState({value});
    },

    handleCheckChange(e){
        var newValues = this.getValue() ? this.getValue().concat() : [];
        if (e.target.checked) {
            newValues.push(e.target.value);
        } else {
            newValues.splice(newValues.indexOf(e.target.value), 1);
        }
        this.props.onValueChange(newValues, this.getValue(), this.props.name, this.props.path);
    },


    _createCheckbox(option, index, group, CheckboxTemplate){


        var id = tu.path(this.props.path, index, group);
        var {val, labelHTML} = option;
        var value = this.state.value;
        var labelContent = labelHTML ? <span dangerouslySetInnerHTML={{__html:labelHTML}}/> : val;
        var opts = {
            onChange: this.handleCheckChange,
            name: this.props.field.name,
            checked: value ? !!~value.indexOf(val) : false,
            ref: id.replace(/\./g, '_'),
            id,
            value: val
        }
        return (<CheckboxTemplate label={labelContent} {...opts}>
            <input type="checkbox" {...opts}/>
        </CheckboxTemplate>);

    },
    _createGroup(option, index, group, Template, CheckboxTemplate){
        return <Template group={option.group}>
            {this.makeOptions(option.options, group == null ? 0 : group, CheckboxTemplate)}
        </Template>

    },


    /**
     * Create the checkbox list HTML
     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     * @return {String} HTML
     */
        makeOptions (array, group) {
        array = array || [];
        var name = this.props.field.name;
        var CheckboxTemplate = loader.loadTemplate(this.props.template);
        var CheckboxesGroupTemplate = loader.loadTemplate(this.props.groupTemplate);
        return array.map((option, index)=> {
            option = tu.isString(option) ? {val: option} : option;
            console.log('key', name + '-' + index + '-' + option.val);
            return (
                <div
                    key={name+'-'+option.val+'-'+group}>{ option.group ? this._createGroup(option, index, group ? group++ : 0, CheckboxesGroupTemplate, CheckboxTemplate) : this._createCheckbox(option, index, group, CheckboxTemplate)}</div>)

        });
    },

    render()
    {

        return <div>{this.makeOptions(this.props.field.options, 1)}</div>
    }
});

module.exports = Checkboxes;