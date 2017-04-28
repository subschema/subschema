import React from 'react';
import importer from './importer';
import {
    ReactCSSReplaceTransition  as _ReactCSSReplaceTransition,
} from  "subschema-component-form";
import {transistions as _transitions, styles as _styles} from "subschema-css-bootstrap";
import _PropTypes from 'subschema-prop-types';
import _ValueManager from 'subschema-valuemanager';
import _processors from 'subschema-processors';
import _Form from 'subschema-core/lib/Form';
import _resolvers from 'subschema-core/lib/resolvers';
import _Dom from 'subschema-component-form/lib/Dom';
import _Field from 'subschema-core/lib/Field';
import _FieldSet from 'subschema-core/lib/FieldSet';
import _Conditional from 'subschema-core/lib/Conditional';
import _RenderContent from 'subschema-core/lib/RenderContent';
import _RenderTemplate from 'subschema-core/lib/RenderTemplate';
import _css from 'subschema-component-form/lib/css';
import _validators from 'subschema-validators';
import _tutils from 'subschema-utils';
import _warning from 'subschema-utils/lib/warning';
import _eventable from 'subschema-valuemanager/lib/eventable';
import _DefaultLoader from './DefaultLoader';
import {newSubschemaContext as _newSubschemaContext} from './core';
import _loaderFactory from 'subschema-loader';
import {stringInjector as _stringInjector, injectorFactory as _injectorFactory} from 'subschema-injection';

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
const eventable = _eventable;
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
    eventable,
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
function newSubschemaContext(defaultLoaders = [_DefaultLoader], defaultResolvers = _resolvers, defaultPropTypes = _PropTypes, defaultInjectorFactory = _injectorFactory, defaultSubschema = Subschema) {
    const ctx = _newSubschemaContext(defaultLoaders, defaultResolvers, defaultPropTypes, defaultInjectorFactory, defaultSubschema);

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
    eventable,
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