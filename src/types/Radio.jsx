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
            value:this.props.value
        }
    },
    componentWillReceiveProps(props){
        this.state.value = props.value;
    },
    getValue(){
        return this.state.value;
    },


    handleCheckChange(e){
        this.props.onValueChange(e.target.value, this.state.value, this.props.name, this.props.path);
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