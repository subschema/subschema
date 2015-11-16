"use strict";
import {FREEZE_OBJ, FREEZE_ARR} from '../tutils';
import {mapTypes, applyFuncs, componentWillMount, componentWillReceiveProps, componentWillUnmount} from '../listenUtil';
import PropTypes from '../PropTypes';
import map from 'lodash/collection/map';


export default function listen(listenTo = "value", path = ".", init = true) {
    if (typeof listenTo !== 'string') {
        var Target = listenTo;
        var name = path;
        var description = init;
        listenTo = "value";
        path = ".";
        init = true;
        listen$config(Target, name, description);
    } else {
        return listen$config;
    }


    function listen$config(Target, name, description) {
        var contextTypes = Target.constructor.contextTypes || (Target.constructor.contextTypes = {});

        if (!contextTypes.valueManager) {
            contextTypes.valueManager = PropTypes.valueManager;
        }
        //If the target has __listeners already then we will assume that this is ours.  We really
        // should use a symbol for this, but then we would have to figure out how to reuse it.
        // this is really pretty fast, 1 array can hold all the listener details.
        if (!Target.__listeners) {
            Target.__listeners = [];
            Target.componentWillMount = applyFuncs(Target.componentWillMount, componentWillMount);
            Target.componentWillUnmount = applyFuncs(Target.componentWillUnmount, componentWillUnmount);
            Target.componentWillReceiveProps = applyFuncs(Target.componentWillReceiveProps, componentWillReceiveProps);
        }

        Target.__listeners.push({
            method: mapTypes[listenTo],
            listeners: {
                [path]: [description.value, init]
            },
            handlers: FREEZE_ARR
        });
    }
}
