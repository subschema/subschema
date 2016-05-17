"use strict";

import _ReactCSSReplaceTransition from "./transition/ReactCSSReplaceTransition";
import _DefaultLoader from "./DefaultLoader";
import * as _templates from "./templates";
import * as _types from "./types";
import * as _processors from "./processors";
import * as _styles from "./styles";
import * as _resolvers from "./resolvers";
import {transitions as _transitions} from "./transition";
import {injectorFactory as _injectorFactory} from "subschema-injection";
import Subschema, {
    Conditional as _C,
    Field as _Field,
    FieldSet as _FieldSet,
    RenderContent as _RenderContent,
    RenderTemplate as _RenderTemplate,
    Form as _F,
    NewChildContext as _N,
    Dom as _D,
    PropTypes as _PropTypes,
    Template as _T,
    ValueManager as _V,
    css as _c,
    eventable as _e,
    listenUtil as _l,
    loaderFactory as _loaderFactory,
    stringInjector as _stringInjector,
    tutils as _t,
    validators as _v,
    warning as _w,
    newSubschemaContext as _newSubschemaContext
} from "./core.js";
export const stringInjector = _stringInjector;
export const injectorFactory = _injectorFactory;
export const RenderTemplate = _RenderTemplate;
export const RenderContent = _RenderContent;
export const loaderFactory = _loaderFactory;
export const Conditional = _C;
export const Field = _Field;
export const FieldSet = _FieldSet;
export const Form = _F;
export const NewChildContext = _N;
export const Dom = _D;
export const PropTypes = _PropTypes;
export const Template = _T;
export const ValueManager = _V;
export const css = _c;
export const eventable = _e;
export const listenUtil = _l;
export const tutils = _t;
export const validators = _v;
export const warning = _w;
export const transitions = _transitions;
export const templates = _templates;
export const types = _types;
export const processors = _processors;
export const styles = _styles;
export const DefaultLoader = _DefaultLoader;
export const resolvers = _resolvers;
export const ReactCSSReplaceTransition = _ReactCSSReplaceTransition;

Subschema.types = _types;
Subschema.templates = _templates;
Subschema.processors = _processors;
Subschema.styles = _styles;
Subschema.resolvers = _resolvers;
Subschema.DefaultLoader = _DefaultLoader;

const _initSubchemaContext = newSubschemaContext();
export const loader = _initSubchemaContext.loader;
export const injector = Subschema.injector = _initSubchemaContext.injector;
export default _initSubchemaContext;

/**
 * Allows for a new Subschema instance to be created. Mostly for testing,
 * but for other stuff, may be useful.
 *
 * @param defaultLoaders
 * @param defaultResolvers
 * @param defaultPropTypes
 */
export function newSubschemaContext(defaultLoaders = [_DefaultLoader], defaultResolvers = _resolvers, defaultPropTypes = _PropTypes, defaultInjectorFactory = _injectorFactory, defaultSubschema = Subschema) {
    return _newSubschemaContext(defaultLoaders, defaultResolvers, defaultPropTypes, defaultInjectorFactory, defaultSubschema);
}