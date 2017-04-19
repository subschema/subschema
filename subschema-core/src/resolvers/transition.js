"use strict";
import PropTypes from 'subschema-prop-types';
import Transition from 'subschema-transition/lib/ReactCSSReplaceTransition';

const EMPTY = {};
export const settings = {
    transition: 'rollUp',
    on: ['enter', 'leave'],
    Transition: Transition
};


export function handleTransition(value, key, props, {loader}) {
    if (value == null || value === false || value.transition === false) {
        return null;
    }
    if (typeof value === 'string') {
        value = {transition: value};
    }

    const {transition, ...config} =  {...settings, ...value};

    const {
        transitionAppearTimeout,
        transitionLeaveTimeout,
        transitionEnterTimeout,
        on,
        transitionName,
        ...rest
    } = typeof transition === 'string' ? {...config, ...loader.loadTransition(transition)} : transition;

    const {enter, enterActive, appear, appearActive, leave, leaveActive} = transitionName || EMPTY;

    const _on = Array.isArray(on) ? on : [on];
    const _transitionName = (rest.transitionName = {});
    //either the original value has the timeout or we have an on
    if (value.transitionEnterTimeout || _on.indexOf('enter') != -1) {
        rest.transitionEnterTimeout = transitionEnterTimeout;
        rest.transitionName.enter = enter;
        rest.transitionName.enterActive = enterActive;
        rest.transitionEnter = true;
    } else {
        rest.transitionEnter = false;
    }

    if (value.transitionAppearTimeout || _on.indexOf('appear') != -1) {
        rest.transitionAppearTimeout = transitionAppearTimeout;
        rest.transitionName.appear = appear;
        rest.transitionName.appearActive = appearActive;
        rest.transitionAppear = true;
    } else {
        rest.transitionAppear = false;
    }

    if (value.transitionLeaveTimeout || _on.indexOf('leave') != -1) {
        rest.transitionLeaveTimeout = transitionLeaveTimeout;
        rest.transitionName.leave = leave;
        rest.transitionName.leaveActive = leaveActive;
        rest.transitionLeave = true;
    } else {
        rest.transitionLeave = false;
    }

    return rest;
}

function transition(Clazz, key) {
    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz::this.property(key, handleTransition);
}
//because es6 modules.
transition.handleTransition = handleTransition;

export default transition;
