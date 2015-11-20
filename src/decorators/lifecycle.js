"use strict";
import {applyFuncs} from '../listenUtil';
import decorator from './decorator';
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
 *  @lifecycle("componentWillMount")
 *  yourFunc(){
 *
 *  }
 */
/**
 * @param stage [strgin=componentWillMount] - The lifecycle method to partake in .
 * @param before [boolean=true] - Run yours before the original or if false after.
 * */
function lifecycle(stage = "componentWillMount", before = true) {
    before = before == null ? true : before;
    return before ? lifecycle$config$before :lifecycle$config$after;
    
    function lifecycle$config$before(Target, name, descriptor) {
        Target[stage] = applyFuncs(descriptor.value, Target[stage]);
    } 

    function lifecycle$config$after(Target, name, descriptor) {
        Target[stage] = applyFuncs(Target[stage], descriptor.value);
    }
}

export default decorator(lifecycle);