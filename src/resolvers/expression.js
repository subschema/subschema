"use strict";

import PropTypes from '../PropTypes';
import SubstituteMixin from '../types/SubstituteMixin';
import {listener, resolveKey,applyNice} from 'subschema-injection/src/util';

function handleExpression(value, key, props, context) {
    const scope = this;
    const expressionVals = {};
    const {valueManager} = context;
    const {listen, format} = SubstituteMixin(value);
    const {injected} = this;
    const {path} = props;
    const ret = listen.reduce((fn, v)=> {
        if (!(v in expressionVals)) {
            //only need to listen to a value once.
            const resolvedKey = resolveKey(path, v);
            return applyNice(valueManager.addListener(resolvedKey, function (val) {
                if (!(v in expressionVals) || expressionVals[v] !== val) {
                    //if the values don't cange the state don't change.
                    expressionVals[v] = val == null ? '' : val;
                    injected[key] = format(expressionVals);
                    scope.forceUpdate();
                }
            }, null, true).remove, fn);

        }
        return fn;
    }, null);
    return ret;
}

export default function expression(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::listener(key, handleExpression);


}