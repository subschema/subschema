"use strict";

import {HashBuilder} from './hash';

export default function cachedInject(injector) {
    let cache;
    let count = 0;
    /**
     * Resolver gets called  a bunch of times,
     * rather than initing WeakMap a million times,
     * let's just do it in the main inject loop.
     *
     * @param propType
     * @param resolver
     * @returns {*}
     */
    function resolver(propType, resolver) {
        if (propType && resolver) {
            //invalidate cache with new resolver
            cache = null;
            count = 0;
        }
        return injector.resolver(propType, resolver);
    }

    function inject(Clazz, extraPropTypes, extraProps, strictProps) {
        if (Clazz == null) {
            return Clazz;
        }
        //we need to generate the hash regardless of having a cache.
        const hash = new HashBuilder(strictProps).addObject(extraPropTypes).addObject(extraProps).toString();
        let cur;
        //no cache so no point in checking it.
        if (cache == null) {
            cache = new WeakMap();
            cur = new Map();
            cache.set(Clazz, cur);
        } else {
            cur = cache.get(Clazz);
            if (cur) {
                const klazz = cur.get(hash);
                if (klazz != null){
                    return klazz;
                }
            } else {
                cur = new Map();
                cache.set(Clazz, cur);
            }
        }

        const injected = injector.inject(Clazz, extraPropTypes, extraProps, strictProps);
        injected.displayName = `${injected.displayName}$${hash}`;
        injected.$hash = hash;
        cur.set(hash, injected);
        count++;
        return injected;
    }
    function size(){
        return count;
    }

    return {
        resolver,
        inject,
        size
    }
}

