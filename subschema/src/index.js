import React from 'react';
import _DefaultLoader from './DefaultLoader';
import importer from './importer';
import _ValueManager from 'subschema-valuemanager';
import { newSubschemaContext as _newSubschemaContext } from 'subschema-core';

export function newSubschemaContext(defaultLoaders             = [_DefaultLoader],
                                    defaultResolvers,
                                    defaultPropTypes,
                                    defaultInjectionFactory,
                                    defaultValueManagerFactory = _ValueManager,
                                    defaultSubschema) {
    const ctx        = _newSubschemaContext(defaultLoaders, defaultResolvers,
        defaultPropTypes, defaultInjectionFactory, defaultValueManagerFactory,
        defaultSubschema);
    ctx.ValueManager = defaultValueManagerFactory;
    ctx.importer     = importer(ctx, React);

    return ctx;
}

const Subschema = newSubschemaContext();

export const injector                  = Subschema.injector;
export const valueManager              = Subschema.valueManager;
export const loader                    = Subschema.loader;
export const Form                      = Subschema.Form;
export const injectorFactory           = Subschema.injectorFactory;
export const RenderTemplate            = Subschema.RenderTemplate;
export const RenderContent             = Subschema.RenderContent;
export const loaderFactory             = Subschema.loaderFactory;
export const Conditional               = Subschema.Conditional;
export const Field                     = Subschema.Field;
export const FieldSet                  = Subschema.FieldSet;
export const Dom                       = Subschema.Dom;
export const PropTypes                 = Subschema.PropTypes;
export const ValueManager              = Subschema.ValueManager;
export const css                       = Subschema.css;
export const tutils                    = Subschema.tutils;
export const validators                = Subschema.validators;
export const warning                   = Subschema.warning;
export const transitions               = Subschema.transitions;
export const processors                = Subschema.processors;
export const styles                    = Subschema.styles;
export const resolvers                 = Subschema.resolvers;
export const ReactCSSReplaceTransition = Subschema.ReactCSSReplaceTransition;
export const SUBSCHEMA_VERSION         = SUBSCHEMA_VERSION;

export default Subschema;
