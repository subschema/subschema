'use strict';

import React, {Component, Children, PropTypes, createElement} from 'react';
import {findDOMNode} from 'react-dom';
import {removeClass, addClass} from 'fbjs/lib/CSSCore';
import ReactTransitionGroup from "react/lib/ReactTransitionGroup";

const onlyChild = Children.only;

// We don't remove the element from the DOM until we receive an animationend or
// transitionend event. If the user screws up and forgets to add an animation
// their node will be stuck in the DOM forever, so we detect if an animation
// does not start and if it doesn't, we just call the end listener immediately.
const TICK = 17;

function _clearTimeout(timeout) {
    clearTimeout(timeout);
}

function _addClass(clz) {
    addClass(this, clz);
}

class EventCSSTransitionGroupChild extends Component {

    transition(animationType, finishCallback, userSpecifiedDelay) {
        const node = findDOMNode(this);

        if (!node) {
            if (finishCallback) {
                finishCallback();
            }
            return;
        }
        const name = this.props.transitionName;
        const className = name[animationType] || name + '-' + animationType;
        const activeClassName = name[animationType + 'Active'] || className + '-active';

        var endListener = function (e) {
            if (e && e.target !== node) {
                return;
            }

            clearTimeout(timeout);

            removeClass(node, className);
            removeClass(node, activeClassName);

            // Usually this optional callback is used for informing an owner of
            // a leave animation and telling it to remove the child.
            if (finishCallback) {
                finishCallback();
            }
        };

        addClass(node, className);

        // Need to do this to actually trigger a transition.
        this.queueClass(activeClassName);
        // Clean-up the animation after the specified delay
        const timeout = setTimeout(endListener, userSpecifiedDelay);
        this.transitionTimeouts.push(timeout);
    };

    queueClass(className) {
        this.classNameQueue.push(className);

        if (!this.timeout) {
            this.timeout = setTimeout(this.flushClassNameQueue, TICK);
        }
    }

    flushClassNameQueue = ()=> {
        if (this.mounted) {
            this.classNameQueue.forEach(_addClass, findDOMNode(this));
        }
        this.classNameQueue.length = 0;
        this.timeout = null;
    };

    componentWillMount() {
        this.classNameQueue = [];
        this.transitionTimeouts = [];
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.transitionTimeouts.forEach(_clearTimeout);
        this.mounted = false;
    }

    componentWillAppear(done) {
        if (this.props.transitionAppearTimeout) {
            this.props.onAppear && this.props.onAppear();
            this.transition('appear', this.props.onDidAppear ? ()=> {
                this.props.onDidAppear(done);
            } : done, this.props.transitionAppearTimeout);
        } else {
            done();
        }
    }

    componentWillEnter(done) {
        if (this.props.transitionEnterTimeout) {
            this.props.onEnter && this.props.onEnter();
            this.transition('enter', this.props.onDidEnter ? ()=> {
                this.props.onDidEnter(done);
            } : done, this.props.transitionEnterTimeout);
        } else {
            done();
        }
    }

    componentWillLeave(done) {
        if (this.props.transitionLeaveTimeout) {
            this.props.onLeave && this.props.onLeave();
            this.transition('leave', this.props.onDidLeave ? ()=> {
                this.props.onDidLeave(done);
            } : done, this.props.transitionLeaveTimeout);
        } else {
            done();
        }
    }

    render() {
        return onlyChild(this.props.children);
    }
}
function transitionProp(props, timeoutPropName, ...rest) {
    if (typeof props.transitionName === 'string' && timeoutPropName === 'transitionAppearTimeout') {
        if (!props[timeoutPropName]) {
            return new Error(`${timeoutPropName}  was not supplied a timeout, this won't work if you only want enter, appear or leave, supply an object to tranistionName with those classes`)
        }
    }else {
        const name = timeoutPropName.replace(/^transition(.*)Timeout$/, '$1');
        if (props.transitionName[name] && !props[timeoutPropName]) {
            return new Error(`${timeoutPropName}  was not supplied a timeout for "${name}", this won't work correctly`);
        }
    }
    return PropTypes.number(props, timeoutPropName, ...rest);
}

export default class EventCSSTransitionGroup extends Component {

    static propTypes = {
        transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
            enter: PropTypes.string,
            enterActive: PropTypes.string,
            leave: PropTypes.string,
            leaveActive: PropTypes.string,
            appear: PropTypes.string,
            appearActive: PropTypes.string
        })]).isRequired,
        //Timeouts enable the transition
        transitionAppearTimeout: transitionProp,
        transitionEnterTimeout: transitionProp,
        transitionLeaveTimeout: transitionProp,

        //Event before hooks
        onAppear: PropTypes.func,
        onEnter: PropTypes.func,
        onLeave: PropTypes.func,
        //Event done hooks
        onDidAppear: PropTypes.func,
        onDidEnter: PropTypes.func,
        onDidLeave: PropTypes.func
    };



    _wrapChild = (child)=> {
        // We need to provide this childFactory so that
        // ReactCSSTransitionGroupChild can receive updates to name, enter, and
        // leave while it is leaving.
        return createElement(EventCSSTransitionGroupChild, this.props, child);

    };

    render() {
        return <ReactTransitionGroup {...this.props} childFactory={this._wrapChild }/>;
    }
}
