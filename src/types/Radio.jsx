var React = require('react');
var tu = require('../tutils');
var loader = require('../loader.jsx');
var BasicFieldMixin = require('../BasicFieldMixin.jsx');

var RadioInput = React.createClass({
    displayName: 'Radio',
    propTypes: {
        title: React.PropTypes.string
    },
    mixins: [BasicFieldMixin],
    getDefaultProps() {
        return {
            title: '',
            name: '',
            placeholder: '',
            template: 'RadioItemTemplate'
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
        if (this.props.field.forceSelection === false || this.props.field.options && this.props.field.options.length === 1) {
            this.updateValue(this._compare(e.target.value, this.state.value) ? null : e.target.value);
        } else {
            this.updateValue(e.target.value);
        }
    },
    makeOptions(options){
        options = options || [];
        var onChange = this.handleCheckChange;
        var value = this.getValue();
        var path = this.props.path;
        return options.map((option, index)=> {
            var {val, label, labelHTML} = tu.isString(option) ? {val: option, label: option} : option;
            if (val == null) {
                val = label;
            }
            if (label == null) {
                label = val;
            }
            var path = option.path = tu.path(path, index);

            return {
                val,
                path,
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
        var options = this.makeOptions(field.options);
        return <div>{options.map((option, index)=> {
            return <RadioItemTemplate  {...option} key={option.path}>
                <input id={fp} type="radio"
                       name={name} {...option} value={option.val}/>
            </RadioItemTemplate>
        }, this)}</div>

    }
});

module.exports = RadioInput;