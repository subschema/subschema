var React = require('../React');
var ReactDOM = require('react-dom');
var css = require('../css');

var Restricted = React.createClass({
    mixins: [require('./RestrictedMixin')],
    componentWillReceiveProps(newProps){
        if (this.props.value !== newProps.value) {
            this._value(newProps.value);
        }

    },
    handleSelectionRange(caret){
        var input = ReactDOM.findDOMNode(this.refs.input);
        if (!input)return;

        if (caret != null)
            input && input.setSelectionRange(caret, caret);
    },
    render(){
        var {onChange, onValueChange, onBlur, className,field,value, dataType, value, type, fieldAttrs, ...props} = this.props
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleValueChange} id={this.props.name}
                      className={css.forField(this)}
                      value={this.state.value}
            {...props} {...fieldAttrs} type={dataType || 'text'} onKeyDown={this.handleKeyDown}/>
    }
});

module.exports = Restricted;