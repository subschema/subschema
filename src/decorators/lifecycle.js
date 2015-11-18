"use strict";
import {applyFuncs} from '../listenUtil';
/**
 * Add a function to the lifecycle. By Default its componentWillMount;
 * it has 2 optional parameters
 *
 * componentWillMount
 *
 * Your function will get invoked before, the down streams component.
 *
 * This allows for nice names, and methods that can be invoked without worry
 * of subclasses being called.
 *
 * @param Target
 * @param name
 * @param descriptor
 * @returns {*}
 */
export default function lifecycle(Target, name, descriptor) {
    if (typeof Target !== 'string') {
        //use the defaults
        return lifecycle$config()(Target, name, descriptor);
    }
    //use the parameter.
    return lifecycle$config(Target);

    function lifecycle$config(stage = "componentWillMount") {
        return function lifecycle$decorator(Target, name, descriptor) {
            Target[stage] = applyFuncs(descriptor.value, Target[stage]);
        }
    }

}