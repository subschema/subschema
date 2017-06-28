import PropTypes from 'subschema-prop-types';

export function unstash$resolver(value, key, props, { valueManager }) {

    const unstash     = () => {

        const stashId = this._stashId;

        if (stashId != null) {
            valueManager.unstash(props.path || this, stashId);
        } else {
            valueManager.unstash(props.path || this);
        }
    };
    unstash.onUnmount = value;
    return unstash
}

export default function unstash(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, unstash$resolver);

    Clazz::this.extendPrototype('componentWillUnmount', function () {
        if (this.state[key] && this.state[key].onUnmount === true) {
            this.state[key]();
        }
    });

}
