var React = require('react'), FieldMixin = require('../FieldMixin.jsx'), Constants = require('../Constants');


var Checkbox = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    doChange:function(e){
        this.props.onValueChange(e.target.checked ? this.props.value || true : null, this.state.value || false, this.props.name, this.props.path);
    },
    render() {
        var className = Constants.clz(Checkbox.inputClassName, this.props.editorClass);
        return <input onBlur={this.handleValidate} onChange={this.doChange} id={this.props.name}
                      className={Checkbox.inputClassName} type="checkbox" value={this.state.value}
                      data-path={this.props.path}
                      title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = Checkbox;