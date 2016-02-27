"use strict";

import {HashBuilder} from './hash';

export default function cachedInject(injector) {
    let cache;

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
            cur = [];
            cache.set(Clazz, cur);
        } else {
            cur = cache.get(Clazz);
            if (cur) {
                for (let klazz of cur) {
                    if (klazz && klazz.$hash === hash) {
                        return klazz;
                    }
                }
            } else {
                cur = [];
                cache.set(Clazz, cur);
            }
        }

        const injected = injector.inject(Clazz, extraPropTypes, extraProps, strictProps);
        injected.$hash = hash;
        cur.push(injected);
        return injected;
    }

    return {
        resolver,
        inject
    }
}

