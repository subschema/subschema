import PropTypes from '../PropTypes';
import {noop, extend} from '../tutils';
import {wrapTarget} from '../listenUtil';
import decorator from './decorator';

function defHandleChange(eventValue, triggerChange, e) {
    return refOrFunc(this, triggerChange).call(this, eventValue(e));
}
function defTriggerChange(value) {
    if (this.props.onChange(value) === false) {
        return false;
    }
    if (this.context.valueManager.update(this.props.path, value) !== false) {
        return this.props.onValueChange(value);
    }
    return false;
}

function defSetValue(value) {
    this.setState({ value });
}
function defEventValue(e) {
    return e && e.target.value;
}
function defHandleValidate(valueFromEvt, e) {
    this.props.onBlur(e);
    this.props.onValidate(valueFromEvt(e), this, e);

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
function setupProps(target, propTypes) {
    if (!target.propTypes) target.propTypes = {};
    if (!target.defaultProps) target.defaultProps = {};

    Object.keys(propTypes).forEach(function (key) {
        if (!target.propTypes[key]) {
            target.propTypes[key] = propTypes[key];
        }
        if (!target.defaultProps[key]) {
            target.defaultProps[key] = noop;
        }
    });
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
 * @param triggerChange {[string=triggerChange|function|false]} - if a string than it will use the defined method on the class to triggerChange. If function than triggerChange will be set to said function.
 * @param eventValue {[function]} - Takes an event and extracts the value.
 * @returns {*}
 */
function field(setValue = 'setValue', handleChange = 'handleChange', handleValidate = 'handleValidate', triggerChange = false, eventValue = defEventValue) {
    return function field$decorate(Target) {
        var handleChangeKey = typeof handleChange === 'function' ? 'handleChange' : handleChange;
        var handleValidateKey = typeof handleValidate === 'function' ? 'handleValidate' : handleValidate;
        var handleSetValueKey = typeof setValue === 'function' ? 'setValue' : setValue;
        var triggerChangeKey = triggerChange === false ? false : typeof triggerChange === 'string' ? triggerChange : 'triggerChange';
        if (triggerChange === true){
            triggerChange = defTriggerChange;
        }
        setupProps(Target, DEFAULT_PROP_TYPES);
        Target.contextTypes = Target.contextTypes ? extend({}, Target.contextTypes, DEFAULT_CONTEXT_TYPES) : DEFAULT_CONTEXT_TYPES;
        var TP = Target.prototype;


        wrapTarget(TP, function init$field(addResult) {
            //init state to prevent blow ups.
            if (this.state == null) {
                this.state = {};
            }

            if (handleChangeKey !== false) {
                this[handleChangeKey] = refOrFunc(this, handleChange, defHandleChange.bind(this, (triggerChangeKey ? triggerChange : defTriggerChange).bind(this), eventValue)).bind(this)
            }
            if (handleValidateKey !== false) {
                this[handleValidateKey] = refOrFunc(this, handleValidate, defHandleValidate.bind(this, eventValue)).bind(this)
            }
            if (triggerChangeKey !== false) {
                this[triggerChangeKey] = refOrFunc(this, triggerChange, defTriggerChange).bind(this);

            }
            var listen = refOrFunc(TP, setValue, defSetValue);
            if (handleSetValueKey !== false) {
                this[handleSetValueKey] = listen.bind(this)

            }


            addResult('value', this.props.path, listen, true);

        });
        return Target;

    }
}
export default decorator(null, field);