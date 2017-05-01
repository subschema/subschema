"use strict";

import PropTypes from 'subschema-prop-types';
import {resolveKey} from 'subschema-utils';

function handleListeners(value, key, props, context) {
    if (value == null) {
        return null;
    }
    const resolvedPath = resolveKey(props.path, value);
    return context.valueManager.addListener(resolvedPath, (v) => {
        if (this.mounted) {
            this.setState({[key]: v});
        } else {
            this.state[key] = v;
        }
    }, null, true).remove;
}

export default function listen(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.listener(key, handleListeners);

}
