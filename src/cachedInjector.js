"use strict";

import {HashBuilder} from './hash';

export default function cachedInject(injector) {
    let cache = new WeakMap();


    function resolver(propType, resolver) {
        if (propType && resolver) {
            //invalidate cache with new resolver
            cache = new WeakMap();
        }
        return injector.resolver(propType, resolver);
    }

    function inject(Clazz, extraPropTypes, extraProps, strictProps) {
        const hash = new HashBuilder(strictProps).addObject(extraPropTypes).addObject(extraProps).toString();
        const cur = cache.get(Clazz);

        if (cur) {
            for (let k in cur) {
                if (k.$hash === hash) {
                    return k;
                }
            }
        }

        const injected = injector.inject(Clazz, extraPropTypes, extraProps, strictProps);
        injected.$hash = hash;

        if (cur) {
            cur.add(injected);
        } else {
            const nwm = new WeakSet();
            nwm.add(injected);
            cache.set(Clazz, nwm);
        }
        return injected;
    }

    return {
        resolver,
        inject
    }
}

