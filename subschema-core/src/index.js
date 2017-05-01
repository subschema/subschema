import loaderFactory from 'subschema-loader';
import PropTypes from 'subschema-prop-types';
import validators from 'subschema-validators';
import warning from 'subschema-utils/lib/warning';
import * as tutils from 'subschema-utils';
import {injectorFactory, cachedInjector, stringInjector} from 'subschema-injection';

import Conditional from './Conditional';
import Content from './Content';
import ContentWrapper from './ContentWrapper';
import Field from './Field';
import FieldSet from './FieldSet';
import Form from './Form';
import Object from './Object';
import RenderContent from './RenderContent';
import RenderTemplate from './RenderTemplate';
import resolvers from './resolvers';

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
                             defaultInjectorFactory = (loader, propTypes) => cachedInjector(stringInjector(injectorFactory(loader), propTypes)),
                             defaultValueManager,
                             Subschema = {
                                 Conditional,
                                 Field,
                                 FieldSet,
                                 RenderContent,
                                 RenderTemplate,
                                 Form,
                                 PropTypes,
                                 loaderFactory,
                                 tutils,
                                 validators,
                                 warning
                             }) {
    const {loader, injector, ...rest} = Subschema;

    const defaultLoader = loaderFactory(defaultLoaders);
    defaultLoader.addResolvers(defaultPropTypes, defaultResolvers);

    //injector can take a loader use it.
    const defaultInjector = defaultInjectorFactory(defaultLoader, defaultPropTypes);

    const formDefaultProps = rest.Form.defaultProps;

    //Form needs these to kick off the whole thing.  Its defaults can be overriden with
    // properties.
    rest.loader = formDefaultProps.loader = defaultLoader;
    rest.injector = formDefaultProps.injector = defaultInjector;
    rest.valueManager = formDefaultProps.valueManager = defaultValueManager();
    return rest;

}

export {
    Conditional,
    Content,
    ContentWrapper,
    Field,
    FieldSet,
    Form,
    Object,
    RenderContent,
    RenderTemplate,
    PropTypes,
    loaderFactory,
    resolvers,
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
    Content,
    ContentWrapper,
    Field,
    FieldSet,
    Form,
    Object,
    RenderContent,
    RenderTemplate,
    PropTypes,
    resolvers,
    cachedInjector,
    injectorFactory,
    loaderFactory,
    tutils,
    validators,
    warning,
    newSubschemaContext
}
