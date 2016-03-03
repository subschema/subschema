"use strict";
import {provide} from './decorators';
import _DefaultLoader from './DefaultLoader';
import * as _templates from './templates';
import * as _types from './types';
import * as _processors from './processors';
import * as _styles from './styles';
import * as _resolvers from './resolvers';
import _loader from './loader';
import provideFactory from './decorators/provideFactory';
import _cachedInjector from './cachedInjector';
import {injectorFactory as _injectorFactory} from 'subschema-injection';
import Subschema, {Conditional as _C,
    Editor as _E,
    Form as _F,
    NewChildContext as _N,
    Constants as _o,
    Dom as _D,
    PropTypes as _PropTypes,
    Template as _T,
    ValueManager as _V,
    css as _c,
    decorators as _decorators,
    eventable as _e,
    injector as _i,
    listenUtil as _l,
    loaderFactory as _loaderFactory,
    tutils as _t,
    validators as _v,
    warning as _w,
    transitions as _n} from './index.js';

export const loaderFactory = _loaderFactory;
export const Conditional = _C;
export const Editor = _E;
export const Form = _F;
export const NewChildContext = _N;
export const Constants = _o;
export const Dom = _D;
export const PropTypes = _PropTypes;
export const Template = _T;
export const ValueManager = _V;
export const css = _c;
export const decorators = _decorators;
export const eventable = _e;
export const listenUtil = _l;
export const tutils = _t;
export const validators = _v;
export const warning = _w;
export const transitions = _n;
export const loader = _loader;
export const templates = _templates;
export const types = _types;
export const processors = _processors;
export const styles = _styles;
export const DefaultLoader = _DefaultLoader;
export const injector = _i;
export const resolvers = _resolvers;

_loader.addLoader([_DefaultLoader]);

Subschema.types = _types;
Subschema.templates = _templates;
Subschema.processors = _processors;
Subschema.styles = _styles;
Subschema.loader = _loader;
Subschema.resolvers = _resolvers;
Subschema.DefaultLoader = _DefaultLoader;
export default newSubschemaContext();

/**
 * Allows for a new Subschema instance to be created. Mostly for testing,
 * but for other stuff, may be useful.
 *
 * @param defaultLoaders
 * @param defaultResolvers
 * @param defaultPropTypes
 */
export function newSubschemaContext(defaultLoaders = [_DefaultLoader], defaultResolvers = _resolvers, defaultPropTypes = _PropTypes, defaultInjectorFactory = _injectorFactory) {
    const {loader, injector, ...rest} = Subschema;


    const _injector = defaultInjectorFactory();
    for (let key of Object.keys(defaultResolvers)) {
        if (key in defaultPropTypes) {
            _injector.resolver(defaultPropTypes[key], defaultResolvers[key]);
        }
    }
    const defaultLoader = _loaderFactory(defaultLoaders);
    const defaultInjector = _cachedInjector(_injector);
    rest.Form.defaultProps.loader = defaultLoader;
    rest.Form.defaultProps.injector = defaultInjector;
    rest.loader = defaultLoader;
    rest.injector = defaultInjector;
    const {provide, ...decs} = _decorators;
    rest.decorators = decs;
    decs.provide = provideFactory({defaultLoader});

    return rest;

}