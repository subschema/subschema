import decorator from './decorator';
/**
 * Bind decorator.  Binds to the first derefence of a function.
 * @example
 *
 * class MyClass {
 *    constructor(){
 *       this.init = 1;
 *    }
 *    @bind
 *    stuff(){
 *       return this.init;
 *    }
 *
 *    @bind([2])
 *    multiplyPlus(multiply, plus){
 *       return this.init * multiply + plus
 *    }
 *
 * }
 * var m = new MyClass();
 * m.stuff();
 * //1;
 *
 * var stuff = m.stuff;
 * stuff();
 * //1
 *
 * var timesPlus = m.multiplyPlus;
 *
 * timesPlus(3);
 * //5
 *
 *
 *
 * @param args
 * @param name
 * @param descriptor
 * @returns {*}
 */
function bind(args = null, name = null, descriptor = null) {

        return function bind$decorator(target, name, descriptor) {
            var {value, writable, configurable, value, ...rest} = descriptor;
            if (args == null) {
                rest.get = function bind$decorator$get() {
                    return value.bind(this);
                }
            } else {
                rest.get = function bind$decoratorg$getWithArgs() {
                    var scope = this;
                    return function (...moreArgs) {
                        return value.apply(scope, args.concat(moreArgs));
                    }
                }
            }
            rest.set = function (newValue) {
                value = newValue;
            }
            rest.bound = true;
            return rest;
    }
}

export default decorator(bind);