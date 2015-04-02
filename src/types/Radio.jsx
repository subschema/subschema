var React = require('react');
var tu = require('../tutils');

var RadioItem = React.createClass({

    render(){
        var {label, labelHTML, id} = this.props;


        label = labelHTML ? <span  dangerouslySetInnerHTML={{__html:labelHTML}}/> : label;

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
            value: '',
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

    getValue(){
        return this.props.value;
    },


    handleCheckChange(e){
        this.props.onValueChange(e.target.value, this.props.value, this.props.name, this.props.path);
    },

    render()
    {
        var {name,template,path, dataType, field, value} = this.props;
        var RadioItemTemplate = template || RadioItem;
        return (<ul>{field.options.map((option, index)=> {
            option = tu.isString(option) ? {label: option, val: option} : option;
            if (!('val' in option)) {
                option.val = option.label || index;
            }
            var onChange = this.handleCheckChange;
            var key = '' + name + option.val, checked = '' + value === '' + option.val;
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