var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants');


var RestrictedInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    handleRestrictedChange: function (e) {

    },
    render() {
        return <div>
            {this.props.field.patternText ? <div className="patternText">{this.props.field.patternText}</div> : null}
            <input ref="input" onBlur={this.handleValidate} onChange={this.handleRestrictedChange} id={this.props.name}
                   className={Constants.clz(RestrictedInput.inputClassName, this.props.editorClass)}
                   type={this.props.dataType}
                   value={this.getValue()}
                   data-path={this.props.path}
                   title={this.props.title} placeholder={this.props.placeholder}/>
        </div>
    }
});

module.exports = RestrictedInput;