var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants');


var HiddenInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <input id={this.props.name}
                      className={Constants.clz(HiddenInput.inputClassName, this.props.editorClass)} type="hidden"
                      value={this.getValue()}
                      data-path={this.props.path}/>
    }
});

module.exports = HiddenInput;