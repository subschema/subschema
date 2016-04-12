"use strict";

import PropTypes from "../PropTypes";
import {resolveKey} from "../tutils";

function handleErrorListeners(value, key, props, {valueManager, validate}) {
    const resolvedPath = resolveKey(props.path, value);
    let errors = valueManager.errorsFor(resolvedPath);

    //If we are validate mode and not having errors, we will validate.
    if (validate && props.validators && !errors) {
        errors = props.validators();
    }
    //no matter what we will show errors at this point
    if (errors && errors[0]) {
        this.injected[key] = errors[0].message;
    }

    return valueManager.addErrorListener(resolvedPath, (err)=> {
        
        this.injected[key] = err && err[0] && err[0].message;
        this.mounted && this.forceUpdate();
    }, this, /**false so it doesn't override*/false).remove;
}

export default function error(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;
    Clazz.contextTypes.validate = PropTypes.bool;
    Clazz::this.listener(key, handleErrorListeners);

}