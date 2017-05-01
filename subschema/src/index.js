import React from 'react';
import importer from './importer';
import {transistions as _transitions, styles as _styles} from "subschema-css-bootstrap";
import _PropTypes from 'subschema-prop-types';
import _ValueManager from 'subschema-valuemanager';
import _processors from 'subschema-processors';
import _loaderFactory from 'subschema-loader';
import _validators from 'subschema-validators';
import _tutils, {warning as _warning} from 'subschema-utils';
import {
    Dom as _Dom,
    css as _css,
    ReactCSSReplaceTransition  as _ReactCSSReplaceTransition
} from 'subschema-component-form';
import {stringInjector as _stringInjector, injectorFactory as _injectorFactory} from 'subschema-injection';

import {
    resolvers as _resolvers,
    Form as _Form,
    Field as _Field,
    FieldSet as _FieldSet,
    Conditional as _Conditional,
    RenderContent as _RenderContent,
    RenderTemplate as _RenderTemplate,
    newSubschemaContext as _newSubschemaContext
} from  "subschema-core";

import _DefaultLoader from './DefaultLoader';


let _types, _templates;

try {
    _types = new Proxy({}, {
        get(target, name) {
            _warning(false, `please do not depend on Subschema.types, use the loader.loadType('%s') instead`, name);
            return _DefaultLoader.loadType(name);
        }
    });
    _templates = new Proxy({}, {
        get(target, name) {
            _warning(false, `please do not depend on Subschema.templates, use the loader.loadTemplate('%s') instead`, name);
            return _DefaultLoader.loadTemplate(name);
        }
    });
} catch (e) {
    warning(false, `types/templates property is longer supported and proxy failed. `, e);
}

const stringInjector = _stringInjector;
const injectorFactory = _injectorFactory;
const RenderTemplate = _RenderTemplate;
const RenderContent = _RenderContent;
const loaderFactory = _loaderFactory;
const Conditional = _Conditional;
const Field = _Field;
const FieldSet = _FieldSet;
const Form = _Form;
const Dom = _Dom;
const PropTypes = _PropTypes;
const ValueManager = _ValueManager;
const css = _css;
const tutils = _tutils;
const validators = _validators;
const warning = _warning;
const transitions = _transitions;
const templates = _templates;
const types = _types;
const processors = _processors;
const styles = _styles;
const DefaultLoader = _DefaultLoader;
const resolvers = _resolvers;
const ReactCSSReplaceTransition = _ReactCSSReplaceTransition;

const _initSubchemaContext = newSubschemaContext();
const loader = _initSubchemaContext.loader;
const injector = _initSubchemaContext.injector;
const Subschema = {
    stringInjector,
    injectorFactory,
    RenderTemplate,
    RenderContent,
    loaderFactory,
    Conditional,
    Field,
    FieldSet,
    Form,
    Dom,
    PropTypes,
    ValueManager,
    css,
    tutils,
    validators,
    warning,
    transitions,
    templates,
    types,
    processors,
    styles,
    DefaultLoader,
    resolvers,
    ReactCSSReplaceTransition,
    loader,
    injector,
    newSubschemaContext
};


/**
 * Allows for a new Subschema instance to be created. Mostly for testing,
 * but for other stuff, may be useful.
 *
 * @param defaultLoaders
 * @param defaultResolvers
 * @param defaultPropTypes
 */
function newSubschemaContext(defaultLoaders = [_DefaultLoader],
                             defaultResolvers = _resolvers,
                             defaultPropTypes = _PropTypes,
                             defaultInjectionFactory,
                             defaultValueManagerFactory=_ValueManager,
                             defaultSubschema = Subschema) {
    const ctx = _newSubschemaContext(defaultLoaders, defaultResolvers, defaultPropTypes, defaultInjectionFactory, defaultValueManagerFactory, defaultSubschema);

    ctx.importer = importer(ctx, React);

    return ctx;
}

export {
    newSubschemaContext,
    stringInjector,
    injectorFactory,
    RenderTemplate,
    RenderContent,
    loaderFactory,
    Conditional,
    Field,
    FieldSet,
    Form,
    Dom,
    PropTypes,
    ValueManager,
    css,
    tutils,
    validators,
    warning,
    transitions,
    templates,
    types,
    processors,
    styles,
    DefaultLoader,
    resolvers,
    ReactCSSReplaceTransition,
    loader,
    injector
};

export default Subschema;