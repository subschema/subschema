var React = require('react');
var FieldMixin = require('../FieldMixin.jsx');
var PropsStateValueMixin = require('../PropsStateValueMixin');
var tu = require('../tutils');

var Checkboxes = React.createClass({
    // mixins: [PropsStateValueMixin],
    getDefaultProps() {
        return {
            value: [],
            title: '',
            name: '',
            placeholder: '',
            dataType: this.dataType,
            onValueChange() {
            },
            onValidate(){
            }
        }

    },

    getValue() {
        return Object.keys(this.refs).filter((v) => {
            return this.refs[v].checked;
        }).map((v)=> {
            return this.refs[v].value;
        })
    },
    handleCheckChange(e){
        var newValues = this.props.value ? this.props.value.concat() : [];
        if (e.target.checked) {
            newValues.push(e.target.value);
        } else {
            newValues.splice(newValues.indexOf(e.target.value), 1);
        }
        this.props.onValueChange(newValues, this.props.value, this.props.name, this.props.path);
    },


    _createCheckbox(option, index, group){


        var id = tu.path(this.props.path, index, group);
        var {val, labelHTML} = option;
        var value = this.props.value || [];
        var labelContent = labelHTML ? <span dangerouslySetInnerHTML={{__html:labelHTML}}/> : val;

        return (<div className="checkbox">
            <label>
                <input ref={id.replace(/\./g, '_')} checked={!!~value.indexOf(val)} type="checkbox"
                       name={this.props.field.name} id={id} value={val}
                       onChange={this.handleCheckChange}/>
                {labelContent}
            </label>
        </div>);

    },
    _createGroup(option, index, group){
        return <fieldset className="group">
            <legend>{option.group}</legend>
            {this.makeOptions(option.options, group == null ? 0 : group)}
        </fieldset>

    },


    /**
     * Create the checkbox list HTML
     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     * @return {String} HTML
     */
        makeOptions (array, group) {

        var name = this.props.field.name;
        return array.map((option, index)=> {
            option = tu.isString(option) ? {val: option} : option;
            console.log('key', name + '-' + index + '-' + option.val);
            return (
                <div
                    key={name+'-'+option.val+'-'+group}>{ option.group ? this._createGroup(option, index, group ? group++ : 0) : this._createCheckbox(option, index, group)}</div>)

        });
    },

    render()
    {

        return <div>{this.makeOptions(this.props.field.options, 1)}</div>
    }
});

module.exports = Checkboxes;