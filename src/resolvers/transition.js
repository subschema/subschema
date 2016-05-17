"use strict";
import PropTypes from '../PropTypes';
import Transition from '../transition/ReactCSSReplaceTransition';

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
        transitionName:{enter, enterActive, appear, appearActive, leave, leaveActive},
        ...rest} = typeof transition === 'string' ? {...config, ...loader.loadTransition(transition)} : transition;

    const _on = Array.isArray(on) ? on : [on];
    const transitionName = (rest.transitionName = {});
    //either the original value has the timeout or we have an on
    if (value.transitionEnterTimeout || _on.indexOf('enter') != -1) {
        rest.transitionEnterTimeout = transitionEnterTimeout;
        transitionName.enter = enter;
        transitionName.enterActive = enterActive;
        rest.transitionEnter = true;
    } else {
        rest.transitionEnter = false;
    }

    if (value.transitionAppearTimeout || _on.indexOf('appear') != -1) {
        rest.transitionAppearTimeout = transitionAppearTimeout;
        transitionName.appear = appear;
        transitionName.appearActive = appearActive;
        rest.transitionAppear = true;
    } else {
        rest.transitionAppear = false;
    }

    if (value.transitionLeaveTimeout || _on.indexOf('leave') != -1) {
        rest.transitionLeaveTimeout = transitionLeaveTimeout;
        transitionName.leave = leave;
        transitionName.leaveActive = leaveActive;
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
