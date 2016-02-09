"use strict";
import {provide} from './decorators';
import _DefaultLoader from './DefaultLoader';
import * as _templates from './templates';
import * as _types from './types';
import * as _processors from './processors';
import * as _styles from './styles';
import _loader from './loader';
import Subschema, {Conditional as _C,
    Editor as _E,
    Form as _F,
    NewChildContext as _N,
    Constants as _o,
    Dom as _D,
    PropTypes as _P,
    Template as _T,
    ValueManager as _V,
    css as _c,
    decorators as _d,
    eventable as _e,
    injector as _i,
    listenUtil as _l,
    loaderFactory as _loaderFactory,
    tutils as _t,
    validators as _v,
    warning as _w,
    transitions as _n} from './index.js';

_loader.addLoader(_DefaultLoader);
provide.defaultLoader = _loader;
export const loaderFactory = _loaderFactory;
export const Conditional = _C;
export const Editor = _E;
export const Form = _F;
export const NewChildContext = _N;
export const Constants = _o;
export const Dom = _D;
export const PropTypes = _P;
export const Template = _T;
export const ValueManager = _V;
export const css = _c;
export const decorators = _d;
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
Subschema.types = _types;
Subschema.templates = _templates;
Subschema.processors = _processors;
Subschema.styles = _styles;
Subschema.loader = _loader;
Subschema.DefaultLoader = _DefaultLoader;
export default Subschema;
