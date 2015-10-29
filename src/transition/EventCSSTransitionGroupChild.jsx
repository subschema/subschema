/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 * @providesModule EventCSSTransitionGroupChild
 */

'use strict';

var React = require("react");
var ReactDOM = require('react-dom');
var CSS = require("../css");
var ReactTransitionEvents = require("react/lib/ReactTransitionEvents");

var onlyChild = require("react/lib/onlyChild");
var warning = require("fbjs/lib/warning");

// We don't remove the element from the DOM until we receive an animationend or
// transitionend event. If the user screws up and forgets to add an animation
// their node will be stuck in the DOM forever, so we detect if an animation
// does not start and if it doesn't, we just call the end listener immediately.
var TICK = 17;
var NO_EVENT_TIMEOUT = 5000;

var noEventListener = null;


if ("production" !== process.env.NODE_ENV) {
    noEventListener = function () {
        ("production" !== process.env.NODE_ENV ? warning(
            false,
            'transition(): tried to perform an animation without ' +
            'an animationend or transitionend event after timeout (' +
            '%sms). You should either disable this ' +
            'transition in JS or add a CSS animation/transition.',
            NO_EVENT_TIMEOUT
        ) : null);
    };
}

var EventCSSTransitionGroupChild = React.createClass({
    displayName: 'EventCSSTransitionGroupChild',

    transition: function (animationType, finishCallback) {
        var node = ReactDOM.findDOMNode(this);
        var className = this.props.name + '-' + animationType;
        var activeClassName = className + '-active';
        var noEventTimeout = null;

        var endListener = function (e) {
            if (e && e.target !== node) {
                return;
            }
            if ("production" !== process.env.NODE_ENV) {
                clearTimeout(noEventTimeout);
            }

            CSS.removeClass(node, className);
            CSS.removeClass(node, activeClassName);

            ReactTransitionEvents.removeEndEventListener(node, endListener);

            // Usually this optional callback is used for informing an owner of
            // a leave animation and telling it to remove the child.
            if (finishCallback) {
                finishCallback();
            }
        };

        ReactTransitionEvents.addEndEventListener(node, endListener);

        CSS.addClass(node, className);

        // Need to do this to actually trigger a transition.
        this.queueClass(activeClassName);

        if ("production" !== process.env.NODE_ENV) {
            noEventTimeout = setTimeout(noEventListener, NO_EVENT_TIMEOUT);
        }
    },

    queueClass: function (className) {
        this.classNameQueue.push(className);

        if (!this.timeout) {
            this.timeout = setTimeout(this.flushClassNameQueue, TICK);
        }
    },

    flushClassNameQueue: function () {
        if (this.isMounted()) {
            this.classNameQueue.forEach(
                CSS.addClass.bind(CSS, ReactDOM.findDOMNode(this))
            );
        }
        this.classNameQueue.length = 0;
        this.timeout = null;
    },

    componentWillMount: function () {
        this.classNameQueue = [];
    },

    componentWillUnmount: function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    },

    componentWillAppear: function (done) {
        if (this.props.appear || this.props.onAppear || this.props.onDidAppear) {
            this.props.onAppear && this.props.onAppear();
            this.transition('appear', this.props.onDidAppear ? ()=>this.props.onDidAppear(done) : done);
        } else {
            done();
        }
    },

    componentWillEnter: function (done) {
        if (this.props.enter || this.props.onEnter || this.props.onDidEnter) {
            this.props.onEnter && this.props.onEnter();
            this.transition('enter', this.props.onDidEnter ? ()=>this.props.onDidEnter(done) : done);
        } else {
            done();
        }
    },

    componentWillLeave: function (done) {
        if (this.props.leave || this.props.onLeave || this.props.onDidLeave) {
            this.props.onLeave && this.props.onLeave();
            this.transition('leave', this.props.onDidLeave ? ()=>this.props.onDidLeave(done) : done);
        } else {
            done();
        }
    },

    render: function () {
        return onlyChild(this.props.children);
    }
});

module.exports = EventCSSTransitionGroupChild;
