var React = require('../react');
var BasicFieldMixin = require('../BasicFieldMixin');
var LoaderMixin = require('../LoaderMixin');
var tu = require('../tutils');
var Constants = require('../Constants');
var css = require('../css');

var Checkboxes = React.createClass({
    statics: {
        inputClassName: Constants.inputCheckboxesClassName,
        subSchema: {
            options: 'OptionSchema'
        }
    },
    mixins: [BasicFieldMixin, LoaderMixin],
    getDefaultProps() {
        return {
            title: '',
            name: '',
            placeholder: '',
            dataType: this.dataType,
            itemTemplate: 'CheckboxesTemplate',
            groupTemplate: 'CheckboxesGroupTemplate',
            onValidate(){
            }
        }

    },

    setValue(value){
        this.setState({value});
    },

    handleCheckChange(e){
        var newValues = this.state.value || [];
        if (e.target.checked) {
            newValues.push(e.target.value);
        } else {
            newValues.splice(newValues.indexOf(e.target.value), 1);
        }
        this.props.handleChange(newValues);
    },


    _createCheckbox(option, index, group, CheckboxTemplate){


        var id = tu.path(this.props.path, index, group);
        var {val, labelHTML} = option;
        var value = this.state.value;
        var labelContent = labelHTML ? <span dangerouslySetInnerHTML={{__html:labelHTML}}/> : val;
        var opts = {
            onChange: this.handleCheckChange,
            name: this.props.name,
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
        var name = this.props.name;
        var CheckboxTemplate = this.template('itemTemplate');
        var CheckboxesGroupTemplate = this.template('groupTemplate');
        return array.map((option, index)=> {
            option = tu.isString(option) ? {val: option} : option;
            return (
                <div
                    key={name+'-'+option.val+'-'+group}>{ option.group ? this._createGroup(option, index, group ? group++ : 0, CheckboxesGroupTemplate, CheckboxTemplate) : this._createCheckbox(option, index, group, CheckboxTemplate)}</div>)

        });
    },

    render()
    {

        return <div
            className={css.forField(this)}>{this.makeOptions(this.props.options, 1)}</div>
    }
});

module.exports = Checkboxes;