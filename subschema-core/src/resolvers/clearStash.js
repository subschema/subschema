import PropTypes from 'subschema-prop-types';

export function clearStash$resolver(value, key, props, { valueManager }) {

    const clearStash    = () => {

        const stashId = this._stashId;
        if (stashId != null) {
            valueManager.clearStash(props.path || this, stashId);
        } else {
            valueManager.clearStash(props.path || this);
        }
    };
    clearStash.onUnmount = value;
    return clearStash
}

export default function clearStash(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, clearStash$resolver);

    Clazz::this.extendPrototype('componentWillUnmount', function () {
        if (this.state[key] && this.state[key].onUnmount === true) {
            this.state[key]();
        }
    });
}

