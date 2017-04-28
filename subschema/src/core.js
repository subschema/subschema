import Conditional from 'subschema-core/lib/Conditional';
import Field from 'subschema-core/lib/Field';
import FieldSet from 'subschema-core/lib/FieldSet';
import RenderContent from 'subschema-core/lib/RenderContent';
import RenderTemplate from 'subschema-core/lib/RenderTemplate';

import Form from 'subschema-core/lib/Form';
import Dom from 'subschema-component-form/lib/Dom';
import eventable from 'subschema-valuemanager/lib/eventable';
import loaderFactory, {resolverLoader} from 'subschema-loader';
import PropTypes from 'subschema-prop-types';
import validators from 'subschema-validators';
import warning from 'subschema-utils/lib/warning';
import * as tutils from 'subschema-utils';
import ValueManager from 'subschema-valuemanager';
import css from 'subschema-component-form/lib/css';
import {injectorFactory, cachedInjector, stringInjector} from 'subschema-injection';

/**
 * Used to initialize new subschema for testing.  But also to override behaviours if necessary.
 *
 * @param defaultLoaders
 * @param defaultResolvers
 * @param defaultPropTypes
 * @param defaultInjectorFactory
 * @param Subschema
 */

function newSubschemaContext(defaultLoaders = [],
                             defaultResolvers = {},
                             defaultPropTypes = PropTypes,
                             defaultInjectorFactory = injectorFactory,
                             Subschema = {
                                 Conditional,
                                 Field,
                                 FieldSet,
                                 RenderContent,
                                 RenderTemplate,
                                 Form,
                                 Dom,
                                 PropTypes,
                                 ValueManager,
                                 css,
                                 eventable,
                                 loaderFactory,
                                 tutils,
                                 validators,
                                 warning,
                                 injectorFactory,
                                 cachedInjector,
                                 stringInjector,

                             }) {
    const {loader, injector, ...rest} = Subschema;

    const defaultLoader = loaderFactory(defaultLoaders);
    defaultLoader.addResolvers(defaultPropTypes, defaultResolvers);

    //injector can take a loader use it.
    const _injector = defaultInjectorFactory(defaultLoader);

    const defaultInjector = cachedInjector(stringInjector(_injector, defaultPropTypes));


    //Form needs these to kick off the whole thing.  Its defaults can be overriden with
    // properties.
    rest.Form.defaultProps.loader = defaultLoader;
    rest.Form.defaultProps.injector = defaultInjector;
    rest.valueManager = rest.Form.defaultProps.valueManager = ValueManager();
    rest.loader = defaultLoader;
    rest.injector = defaultInjector;

    return rest;

}

export {
    Conditional,
    Field,
    FieldSet,
    RenderContent,
    RenderTemplate,
    Form,
    Dom,
    PropTypes,
    ValueManager,
    css,
    eventable,
    loaderFactory,
    tutils,
    validators,
    warning,
    injectorFactory,
    stringInjector,
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
    Dom,
    PropTypes,
    ValueManager,
    css,
    eventable,
    cachedInjector,
    injectorFactory,
    loaderFactory,
    tutils,
    validators,
    warning,
    newSubschemaContext
}
