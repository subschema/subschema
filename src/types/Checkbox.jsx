var React = require('react'), FieldMixin = require('../FieldMixin.jsx'), Constants = require('../Constants');


var Checkbox = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: ''//Constants.inputClassName
    },
    doChange: function (e) {
        var hasProp = 'value' in this.props;
        this.updateValue(e.target.checked ? hasProp ? this.props.value : true : hasProp ? null : false);
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