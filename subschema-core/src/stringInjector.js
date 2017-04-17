"use strict";

export default function stringInjector(injector, PropTypes) {
    if (!PropTypes) {
        return injector;
    }
    //reimplement resolveProp
    function resolveProp(propType) {
        if (typeof propType === 'string') {
            return injector.resolveProp(PropTypes[propType]);
        }
        return injector.resolveProp(propType);
    };
    //return a copy.
    return {
        ...injector,
        resolveProp
    }

}