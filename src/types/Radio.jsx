var React = require('react');
var tu = require('../tutils');

var RadioItem = React.createClass({

    render(){
        var {label, labelHTML, id} = this.props;


        label = labelHTML ? <span dangerouslySetInnerHTML={{__html:labelHTML}}/> : label;

        return (<div className="radio">
            <label>
                {this.props.children}
                {label}
            </label>
        </div>);
    }
});

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
            template: RadioItem
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

    render()
    {
        var {name,template,path, dataType, field} = this.props;
        var value = this.getValue();
        var RadioItemTemplate = template || RadioItem;
        return (<ul>{field.options.map((option, index)=> {
            option = tu.isString(option) ? {label: option, val: option} : option;
            if (!('val' in option)) {
                option.val = option.label || index;
            }
            var onChange = this.handleCheckChange;
            var key = '' + name + option.val, checked = this._compare(value, option.val);
            return <RadioItemTemplate key={key}
                                      id={path}
                                      name={name}
                                      label={option.label}
                                      val={option.val}
                                      dataType={dataType}
                                      labelHTML={option.labelHTML}
                                      checked={checked}>
                <input checked={checked} type={dataType}
                       name={name} id={path} value={option.val}
                       onChange={onChange}/>
            </RadioItemTemplate>


        }, this)}</ul>)
    }
});

module.exports = RadioInput;