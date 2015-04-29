var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var HiddenInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <input id={this.props.name}
                      className={css.forField(this)} type="hidden"
                      value={this.state.value}
                      data-path={this.props.path}/>
    }
});

module.exports = HiddenInput;