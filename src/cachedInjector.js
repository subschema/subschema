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
        if (cache == null) {
            cache = new WeakMap();
        }
        const hash = new HashBuilder(strictProps).addObject(extraPropTypes).addObject(extraProps).toString();
        const cur = cache.get(Clazz);

        if (cur) {
            for (let klazz of cur) {
                if (klazz && klazz.$hash === hash) {
                    return klazz;
                }
            }
        }

        const injected = injector.inject(Clazz, extraPropTypes, extraProps, strictProps);
        injected.$hash = hash;

        if (cur) {
            cur.push(injected);
        } else {
            cache.set(Clazz, [injected]);
        }
        return injected;
    }

    return {
        resolver,
        inject
    }
}

