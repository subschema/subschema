"use strict";

import PropTypes from '../PropTypes';

const opRe = /^(==|===|!=|!==|>=|>|truthy|falsey|<|<=|(\!)?\/(.*)\/([gimy])?)$/;
const eq = function (compare, value) {
    return value == compare
}, eqeq = function (compare, value) {
    return value === compare
}, ne = function (compare, value) {
    return value != compare
}, neeq = function (compare, value) {
    return value !== compare
}, gt = function (compare, value) {
    return value > compare
}, gteq = function (compare, value) {
    return value >= compare
}, lt = function (compare, value) {
    return value < compare
}, lteq = function (compare, value) {
    return value <= compare
}, truthy = function (compare) {
    return !!compare;
}, falsey = function (compare) {
    return !compare;
};

const opFactory = (function opFactory$factory(scope) {

    return (operator)=> {
        switch (operator) {
            case 'truthy':
                return truthy;
            case 'falsey':
                return falsey;
            case '==':
                return eq;
            case '===':
                return eqeq;
            case '!=':
                return ne;
            case '!==':
                return neeq;
            case '>':
                return gt;
            case '>=':
                return gteq;
            case '<':
                return lt;
            case '<=':
                return lteq;

            default:
            {
                throw new Error('Unknown operator [' + operator + ']')
            }
        }
    }
}());
export function loadOperator(operator, key, props, context) {

    if (operator instanceof RegExp) {
        return (compare, value) =>operator.test(compare, value);
    }
    if (typeof operator === 'function') {
        return operator;
    }
    if (typeof operator === 'string') {
        var os = opRe.exec(operator);
        if (os) {
            if (os[3] != null) {
                operator = new RegExp(os[3], os[4]);
                if (os[2] == null) {
                    return (compare, value) => operator.test(compare);
                } else {
                    return (compare, value) => !operator.test(compare);
                }
            }
            return opFactory(operator);
        } else {
            return context.loader.loadOperator(operator);
        }
    }
    return operator;

}

export default function operator(Clazz, key) {
    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz::this.property(key, loadOperator);
}
