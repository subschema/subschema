import PropTypes from 'subschema-prop-types';
import warning from 'subschema-utils/lib/warning';
const EMPTY           = {};
export const settings = {
    transition: 'rollUp',
    on        : ['enter', 'leave'],
    Transition(props) {
        warning(false,
            `Please set subschema-core.resolvers.transition.settings.Transition to a transition handler`);
        return EmptyTransition(props);
    }

};
const EmptyTransition = ({ children }) => {
    return Array.isArray(children) ? children[0] : children;
};
const NO_TRANSITION   = {
    Transition: EmptyTransition
};

export function handleTransition(value, key, props, { loader }) {
    if (value == null) {
        return value;
    }
    if (value === false || value.transition === false) {
        return NO_TRANSITION;
    }
    if (typeof value === 'string') {
        value = { transition: value };
    }

    const { transition, ...config } = { ...settings, ...value };

    const {
              transitionAppearTimeout,
              transitionLeaveTimeout,
              transitionEnterTimeout,
              on,
              transitionName,
              ...rest
          } = typeof transition === 'string'
        ? { ...config, ...loader.loadTransition(transition) } : transition;

    const { enter, enterActive, appear, appearActive, leave, leaveActive } = transitionName
                                                                             || EMPTY;

    const _on             = Array.isArray(on) ? on : [on];
    const _transitionName = (rest.transitionName = {});
    //either the original value has the timeout or we have an on
    if (value.transitionEnterTimeout || _on.indexOf('enter') != -1) {
        rest.transitionEnterTimeout     = transitionEnterTimeout;
        rest.transitionName.enter       = enter;
        rest.transitionName.enterActive = enterActive;
        rest.transitionEnter            = true;
    } else {
        rest.transitionEnter = false;
    }

    if (value.transitionAppearTimeout || _on.indexOf('appear') != -1) {
        rest.transitionAppearTimeout     = transitionAppearTimeout;
        rest.transitionName.appear       = appear;
        rest.transitionName.appearActive = appearActive;
        rest.transitionAppear            = true;
    } else {
        rest.transitionAppear = false;
    }

    if (value.transitionLeaveTimeout || _on.indexOf('leave') != -1) {
        rest.transitionLeaveTimeout     = transitionLeaveTimeout;
        rest.transitionName.leave       = leave;
        rest.transitionName.leaveActive = leaveActive;
        rest.transitionLeave            = true;
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
