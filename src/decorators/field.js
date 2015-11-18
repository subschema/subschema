import PropTypes from '../PropTypes';
import {noop,extend} from '../tutils';
import {wrapTarget} from '../listenUtil';

function defHandleChange(eventValue, e) {
    var value = eventValue(e);
    if (this.props.onChange(value) === false) {
        return false;
    }
    if (this.context.valueManager.update(this.props.path, value) !== false) {
        return this.props.onValueChange(value);
    }
    return false;
}

function defSetValue(value) {
    this.setState({value});
}
function defEventValue(e) {
    return e && e.target.value;
}
function defHandleValidate(valueFromEvt, e) {
    this.props.onBlur(e);
    this.props.onValidate(valueFromEvt(e), this, e);

}
const DEFAULT_PROPS = {
    onValueChange: noop,
    onChange: noop,
    onValidate: noop,
    onBlur: noop
}

const DEFAULT_CONTEXT_TYPES = {
    valueManager: PropTypes.valueManager
}

const DEFAULT_PROP_TYPES = {
    onValueChange: PropTypes.event,
    onChange: PropTypes.event,
    onValidate: PropTypes.event,
    onBlur: PropTypes.event
}

function refOrFunc(obj, key, defValue) {
    if (typeof key === 'function') {
        return key;
    }
    if (obj[key]) {
        return obj[key];
    }
    return (defValue);
}
/**
 * Mark a React Component as Type.  This adds lifecycle methods connecting the
 * path to the valueManager.   In addition it will add if not already defined on the object
 *
 * It also initializes this.state.value to the value of this.props.value.
 *
 * setValue(value)
 * handleChange(e)
 * handleValidate(e)
 *
 * @param setValue {[string=setValue]|function|false} - if String than it will use the defined method to setValue.  If function than Class.setValue will be set to that function
 * @param handleChange {[string=handleChange|function|false]} - if A string than it will use defined method to handleChange. If function than handleChange will be assigned to said function.
 * @param handleValidate {[string=handleValidate|function|false]} - if a string than it will use the defined method on the class to validate. If function than handleValidate will be set to said function.
 * @param eventValue {[function]} - Takes an event and extracts the value.
 * @returns {*}
 */
export default function field(setValue = 'setValue', handleChange = 'handleChange', handleValidate = 'handleValidate', eventValue = defEventValue) {
    if (typeof setValue !== 'string') {
        var Target = setValue;
        setValue = 'setValue';
        handleChange = 'handleChange';
        eventValue = defEventValue;
        return field$decorate(Target);
    } else {
        return field$decorate;
    }
    function field$decorate(Target) {
        var handleChangeKey = typeof handleChange === 'function' ? 'handleChange' : handleChange;
        var handleValidateKey = typeof handleValidate === 'function' ? 'handleValidate' : handleValidate;
        var handleSetValueKey = typeof setValue === 'function' ? 'setValue' : setValue;

        Target.propTypes = Target.propTypes ? extend({}, Target.propTypes, DEFAULT_PROP_TYPES) : DEFAULT_PROP_TYPES;
        Target.contextTypes = Target.contextTypes ? extend({}, Target.contextTypes, DEFAULT_CONTEXT_TYPES) : DEFAULT_CONTEXT_TYPES;
        Target.defaultProps = Target.defaultProps ? extend({}, Target.defaultProps, DEFAULT_PROPS) : DEFAULT_PROPS;

        wrapTarget(Target.prototype, function init$field(addResult) {
            if (handleChangeKey !== false) {
                this[handleChangeKey] = refOrFunc(this, handleChange, defHandleChange).bind(this, eventValue);
            }

            if (handleValidateKey !== false) {
                this[handleValidateKey] = refOrFunc(this, handleValidate, defHandleValidate).bind(this, eventValue);
            }

            if (handleSetValueKey !== false) {
                var listen = this[handleSetValueKey] = refOrFunc(this, setValue, defSetValue);
                addResult('value', this.props.path, listen, true);
            }
            this.setState({[this.props.path]: this.props.value});
        });
        return Target;

    }
}