var React = require('react');
var tu = require('../tutils');
var loader = require('../loader.jsx');


var RadioInput = React.createClass({
    getDefaultProps() {
        return {
            title: '',
            name: '',
            placeholder: '',
            dataType: 'radio',
            onValueChange() {
            },
            onValidate(){
            },
            template: 'RadioItemTemplate'
        }

    },
    getInitialState(){
        return {
            value: this.props.value
        }
    },
    setValue(value){
        this.setState({value});
    },

    getValue(){
        return this.state.value;
    },

    _compare(val, val2){
        if (val == null && val2 == null) {
            return true;
        }
        if (val == null || val2 == null) return false;
        return ('' + val === '' + val2);
    },
    handleCheckChange(e){
        //Make a radio behave like a checkbox when there is only 1.
        if (this.props.field.options.length === 1) {
            this.props.onValueChange(this._compare(e.target.value, this.state.value) ? null : e.target.value, this.state.value, this.props.name, this.props.path);
        } else {
            this.props.onValueChange(e.target.value, this.state.value, this.props.name, this.props.path);
        }
    },
    makeOptions(options){
        var onChange = this.handleCheckChange;
        var value = this.getValue();
        return options.map((option, index)=> {
            var {val, label, labelHTML} = tu.isString(option) ? {val: option, label: option} : option;
            if (val == null) {
                val = label;
            }
            if (label == null) {
                label = val;
            }
            return {
                val,
                label,
                labelHTML,
                onChange,
                checked: this._compare(value, val)
            }
        });
    },
    render()
    {
        var {name,template,path, dataType, field} = this.props;

        var RadioItemTemplate = loader.loadTemplate(template);

        return (<ul>{this.makeOptions(field.options).map((option, index)=> {

            option.key = '' + name + option.val;

            return <RadioItemTemplate {...option}>
                <input id={path} type={dataType}
                       name={name} {...option}/>
            </RadioItemTemplate>


        }, this)}</ul>)
    }
});

module.exports = RadioInput;