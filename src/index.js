"use strict";

import Conditional from './components/Conditional.jsx';
import Field from './components/Field.jsx';
import FieldSet from './components/FieldSet.jsx';
import RenderContent from './components/RenderContent.jsx';
import RenderTemplate from './components/RenderTemplate.jsx';
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
import {injectorFactory} from 'subschema-injection';
import cachedInjector from './cachedInjector';
import provideFactory from './decorators/provideFactory';
export {
    Conditional,
    Field,
    FieldSet,
    RenderContent,
    RenderTemplate,
    Form,
    NewChildContext,
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
    injectorFactory,
    cachedInjector,
    newSubschemaContext
};
export default {
    Conditional,
    Field,
    FieldSet,
    RenderContent,
    RenderTemplate,
    Form,
    NewChildContext,
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
    newSubschemaContext
}

/**
 * Used to initialize new subschema for testing.  But also to override behaviours if necessary.
 *
 * @param defaultLoaders
 * @param defaultResolvers
 * @param defaultPropTypes
 * @param defaultInjectorFactory
 * @param Subschema
 */

function newSubschemaContext(defaultLoaders = [], defaultResolvers = {}, defaultPropTypes = PropTypes, defaultInjectorFactory = injectorFactory, Subschema = {
    Conditional,
    Field,
    FieldSet,
    RenderContent,
    RenderTemplate,
    Form,
    NewChildContext,
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
    injectorFactory,
    cachedInjector

}) {
    const {loader, injector,  ...rest} = Subschema;


    const _injector = defaultInjectorFactory();
    for (let key of Object.keys(defaultResolvers)) {
        if (key in defaultPropTypes) {
            _injector.resolver(defaultPropTypes[key], defaultResolvers[key]);
        }
    }
    const defaultLoader = loaderFactory(defaultLoaders);
    const defaultInjector = cachedInjector(_injector);

    //Form needs these to kick off the whole thing.  Its defaults can be overriden with
    // properties.
    rest.Form.defaultProps.loader = defaultLoader;
    rest.Form.defaultProps.injector = defaultInjector;
    rest.loader = defaultLoader;
    rest.injector = defaultInjector;
    const {provide, ...decs} = decorators;
    rest.decorators = decs;
    //provide has a reference to the current status loader.   this makes it work.
    decs.provide = provideFactory({defaultLoader});

    return rest;

}