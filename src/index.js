"use strict";

import Conditional from './components/Conditional.jsx';
import Editor from './components/Field.jsx';
import NewChildContext from './components/NewChildContext.jsx';
import Form from './components/Form.jsx';
import Dom from './Dom';
import eventable from './eventable';
import loaderFactory from './loaderFactory';
import PropTypes from './PropTypes';
import validators from './validators';
import warning from './warning';
import * as tutils from './tutils';
import ValueManager from './ValueManager';
import css from './css';
import * as decorators from './decorators/index';
import Constants from './Constants';
import transitions from './transition/EventCSSTransitionGroup.jsx';
import {injectorFactory} from 'subschema-injection';
import cachedInjector from './cachedInjector';
import provideFactory from './decorators/provideFactory';
export {
    Conditional,
    Editor,
    Form,
    NewChildContext,
    Constants,
    Dom,
    PropTypes,
    ValueManager,
    css,
    decorators,
    eventable,
    injectorFactory,
    loaderFactory,
    tutils,
    validators,
    warning,
    transitions,
    injectorFactory,
    cachedInjector,
    newSubschemaContext
};
export default {
    Conditional,
    Editor,
    Form,
    NewChildContext,
    Constants,
    Dom,
    PropTypes,
    ValueManager,
    css,
    decorators,
    eventable,
    cachedInjector,
    injectorFactory,
    loaderFactory,
    tutils,
    validators,
    warning,
    transitions,
    newSubschemaContext
}

function newSubschemaContext(defaultLoaders = [], defaultResolvers = {}, defaultPropTypes = PropTypes, defaultInjectorFactory = injectorFactory, Subschema = {
    Conditional,
    Editor,
    Form,
    NewChildContext,
    Constants,
    Dom,
    PropTypes,
    ValueManager,
    css,
    decorators,
    eventable,
    injector,
    loader,
    loaderFactory,
    tutils,
    validators,
    warning,
    transitions,
    injectorFactory,
    cachedInjector

}) {
    const {loader, injector, ...rest} = Subschema;


    const _injector = defaultInjectorFactory();
    for (let key of Object.keys(defaultResolvers)) {
        if (key in defaultPropTypes) {
            _injector.resolver(defaultPropTypes[key], defaultResolvers[key]);
        }
    }
    const defaultLoader = loaderFactory(defaultLoaders);
    const defaultInjector = cachedInjector(_injector);
    rest.Form.defaultProps.loader = defaultLoader;
    rest.Form.defaultProps.injector = defaultInjector;
    rest.loader = defaultLoader;
    rest.injector = defaultInjector;
    const {provide, ...decs} = decorators;
    rest.decorators = decs;
    decs.provide = provideFactory({defaultLoader});

    return rest;

}