"use strict";

import PropTypes from "../PropTypes";
import expression from "subschema-expression";
import {resolveKey, applyFuncs, FREEZE_OBJ} from "../tutils";
import warning from "../warning";
function handleExpression(value, key, props, {valueManager, loader}) {
    const scope = this;
    const expressionVals = {};
    const {listen, format, formatters=[]} = expression(value);
    const {injected} = this;
    const {path} = props;
    const fmts = loader && loader.loadFormatter && formatters.reduce(function (obj, key) {

            obj[key] = loader.loadFormatter(key);
            warning(obj[key], 'No formatter loaded for %s', key);
            return obj;

        }, {}) || FREEZE_OBJ;

    //if there is a formatter without any  listeners we need to format it.
    if (listen.length === 0 && formatters.length) {
        injected[key] = format({}, fmts);
    }

    const ret = listen.reduce((fn, v)=> {
        if (!(v in expressionVals)) {
            //only need to listen to a value once.
            const resolvedKey = resolveKey(path, v);
            return applyFuncs(valueManager.addListener(resolvedKey, function (val) {
                if (!(v in expressionVals) || expressionVals[v] !== val) {
                    //if the values don't cange the state don't change.
                    expressionVals[v] = val == null ? '' : val;
                    injected[key] = format(expressionVals, fmts);
                    scope.forceUpdate();
                }
            }, null, true).remove, fn);

        }
        return fn;
    }, null);
    return ret;
}

export default function expression$resolver(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;
    Clazz.contextTypes.loader = PropTypes.loader;

    Clazz::this.listener(key, handleExpression);


}