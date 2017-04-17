"use strict";
import React, {Component} from "react";
import {keyIn, onlyKeys, uniqueKeys, extendPrototype, listener, unmount, prop as property} from "./util";


export class BaseInjectComponent extends Component {
    state = {};
    injected = {};

    render() {
        const {_copyPropTypeKeys, Clazz} = this.constructor;
        const props = onlyKeys(_copyPropTypeKeys, this.injected, this.props);
        return <Clazz {...props} {...this.injected }>{this.props.children}</Clazz>
    }
}

function hasAnyKeys(obj) {
    if (!obj) return false;
    return Object.keys(obj).length > 0;
}
function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false
    }
    return obj[Symbol.iterator] !== void(0)
}
export default function injector(resolvers = new Map()) {
    if (!(resolvers instanceof Map )) {
        if (isIterable(resolvers)) {
            resolvers = new Map(resolvers);
        } else {
            throw new Error('resolvers must be iterable');
        }
    }
    function resolveProp(propType) {
        if (propType == null) return propType;
        const resolved = resolvers.get(propType);
        return resolved;
    }


    const Injector = {

        resolveProp,
        resolver(propType, resolve){
            if (propType == null || resolve == null) {
                throw new Error('must define both a propType and a resolver');
            }
            if (propType.isRequired) {
                resolvers.set(propType.isRequired, resolve);
            }
            resolvers.set(propType, resolve);
        },
        unmount,
        listener,
        property,
        extendPrototype,
        createWrapperClass(Clazz, copyPropTypeKeys){

            const {name, displayName} = Clazz;
            //BaseInjectComponent is just a marker class.
            class InjectedClass extends BaseInjectComponent {
                static defaultProps = {};
                static contextTypes = {};
                static displayName = `${displayName || name}$Wrapper`;
                static Clazz = Clazz;
                static _copyPropTypeKeys = copyPropTypeKeys;
            }
            return InjectedClass
        },
        /**
         * Injects properties based propType.
         *
         * @param Clazz - class to wrap.
         * @param extraPropTypes - extra prop types if the component does not have the propType than it will use this propType, otherwise the
         * the class'es default propType will be used.
         * @param extraProps - If a component has a defaultProp than it will use that otherwise it will use this.
         * @returns {*}
         */

        inject(Clazz, extraPropTypes, extraProps){
            const hasExtra = hasAnyKeys(extraPropTypes) || hasAnyKeys(extraProps);

            const {defaultProps, propTypes, injectedProps, injectedPropTypes} = Clazz;

            const propTypeKeys = uniqueKeys(injectedProps, injectedPropTypes, propTypes, defaultProps, extraPropTypes);

            const [...copyPropTypeKeys] = propTypeKeys;

            const start = hasExtra ? this.createWrapperClass(Clazz, copyPropTypeKeys) : null;

            const injected = propTypeKeys.reduce((injectedClass, key)=> {

                const resolver = this.resolveProp(keyIn(key, injectedPropTypes, propTypes, extraPropTypes));
                //resolver is null, nothing to do just return.
                if (resolver == null) {
                    return injectedClass;
                }
                //injectedClass may be null if it didn't have any extras.  So we will create if it is.
                injectedClass = injectedClass || this.createWrapperClass(Clazz, copyPropTypeKeys);

                //Add default props to this thing.
                injectedClass.defaultProps[key] = keyIn(key, injectedProps, defaultProps, extraProps);

                //Resolver could return a different class.
                const nextClass = resolver.call(Injector, injectedClass, key, propTypeKeys, Clazz);

                //If a different class was null, return the original class.
                return (nextClass == null) ? injectedClass : nextClass;
            }, start);
            return injected || Clazz;
        }
    };
    return Injector;
}
