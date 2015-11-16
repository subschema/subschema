import PropTypes from '../PropTypes';
import {noop} from '../tutils';
import {applyFuncs,addResult, componentWillMount, componentWillReceiveProps, componentWillUnmount} from '../listenUtil';

function handleChange(eventValue, e) {
    var value = eventValue(e);
    if (this.context.valueManager.update(this.props.path, value) !== false) {
        return this.props.onValueChange(value);
    }
    return false;
}

function handleState(value) {
    this.setState({value});
}
function defaultEventValue(e) {
    return e && e.target.value;
}

export default function field(setValue = 'setValue', triggerChange = 'handleChange', eventValue = defaultEventValue) {
    if (typeof setValue !== 'string') {
        var Target = setValue;
        setValue = 'setValue';
        triggerChange = 'handleChange';
        eventValue = defaultEventValue;
        return field$decorate(Target);
    } else {
        return field$decorate;
    }
    function field$decorate(Target) {

        return class Field extends Target {
            static contextTypes = {
                valueManager: PropTypes.valueManager
            };
            static  defaultProps = {
                onValueChange: noop
            };

            constructor(props) {
                super(props);
                this.state = {value: props && props.value}

                if (this[triggerChange] == null) {
                    this[triggerChange] = handleChange.bind(this, eventValue);
                }

                if (this[setValue] == null) {
                    this[setValue] = handleState;
                }

                addResult('addListener', {[this.props.path]: this[setValue]}, this.__listeners || (this.__listeners = []));

                this.componentWillMount = applyFuncs(this.componentWillMount, componentWillMount);
                this.componentWillUnmount = applyFuncs(this.componentWillUnmount, componentWillUnmount);
                this.componentWillReceiveProps = applyFuncs(this.componentWillReceiveProps, componentWillReceiveProps);
            }
        }
    }
}