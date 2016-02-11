"use strict";

import {HashBuilder} from './hash';

export default function cachedInject(injector) {
    const cache = [];

    function resolver(propType, resolver) {
        if (propType && resolver) {
            //invalidate cache with new resolver
            cache.length = 0;
        }
        return injector.resolver(propType, resolver);
    }

    function inject(Clazz, extraPropTypes, extraProps, strictProps) {
        const hash = new HashBuilder(strictProps).addObject(extraPropTypes).addObject(extraProps).toString();
        const length = cache.length;
        for (let i = 0; i < length; i++) {
            const cur = cache[i];
            if (cur[1] === Clazz && cur[2] === hash) {
                return cur[0];
            }
        }
        const injected = injector.inject(Clazz, extraPropTypes, extraProps, strictProps);
        cache.push([injected, Clazz, hash]);
        return injected;
    }

    return {
        resolver,
        inject
    }
}

