"use strict";

import injectorFactory from 'subschema-injection/src/injectorFactory';
import PropTypes from './PropTypes';
import resolvers from './resolvers';
import cached from './cachedInjector';
const injector = injectorFactory();

Object.keys(resolvers).forEach((r)=> {
    if (r in PropTypes) {
        injector.resolver(PropTypes[r], resolvers[r]);
    } else {
        console.log(`no prop type for ${r}`);
    }
});

export default cached(injector);