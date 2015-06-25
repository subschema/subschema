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

var assign = require("react/lib/Object.assign");

var ReactTransitionGroup = React.createFactory(
    require("react/lib/ReactTransitionGroup")
);
var EventCSSTransitionGroupChild = React.createFactory(
    require("./EventCSSTransitionGroupChild.jsx")
);

var EventCSSTransitionGroup = React.createClass({
    displayName: 'EventCSSTransitionGroup',

    propTypes: {
        transitionName: React.PropTypes.string.isRequired,
        transitionAppear: React.PropTypes.bool,
        transitionEnter: React.PropTypes.bool,
        transitionLeave: React.PropTypes.bool,
        onAppear: React.PropTypes.func,
        onDidAppear: React.PropTypes.func,
        onEnter: React.PropTypes.func,
        onDidEnter: React.PropTypes.func,
        onLeave: React.PropTypes.func,
        onDidLeave: React.PropTypes.func
    },


    _wrapChild: function (child) {
        // We need to provide this childFactory so that
        // ReactCSSTransitionGroupChild can receive updates to name, enter, and
        // leave while it is leaving.
        return EventCSSTransitionGroupChild(
            {
                name: this.props.transitionName,
                onAppear: this.props.onAppear,
                onEnter: this.props.onEnter,
                onLeave: this.props.onLeave,

                onDidAppear: this.props.onDidAppear,
                onDidLeave: this.props.onDidLeave,
                onDidEnter: this.props.onDidEnter,

                enter:this.props.transitionEnter,
                leave:this.props.transitionLeave,
                appear:this.props.transitionAppear
            },
            child
        );
    },

    render: function () {
        return (
            ReactTransitionGroup(
                assign({}, this.props, {childFactory: this._wrapChild})
            )
        );
    }
});

module.exports = EventCSSTransitionGroup;
