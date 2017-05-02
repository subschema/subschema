import _loaderFactory from 'subschema-loader';
import _PropTypes from 'subschema-prop-types';
import _tutils, {warning as _warning} from 'subschema-utils';
import {injectorFactory, cachedInjector, stringInjector} from 'subschema-injection';

import _Conditional from './Conditional';
import _Content from './Content';
import _ContentWrapper from './ContentWrapper';
import _Field from './Field';
import _FieldSet from './FieldSet';
import _Form from './Form';
import _Object from './Object';
import _RenderContent from './RenderContent';
import _RenderTemplate from './RenderTemplate';
import _resolvers from './resolvers';

export const PropTypes = _PropTypes;
export const loaderFactory = _loaderFactory;
export const warning = _warning;
export const tutils = _tutils;
export const Conditional = _Conditional;
export const Content = _Content;
export const ContentWrapper = _ContentWrapper;
export const Field = _Field;
export const FieldSet = _FieldSet;
export const Form = _Form;
export const ObjectType = _Object;
export const RenderContent = _RenderContent;
export const RenderTemplate = _RenderTemplate;
export const resolvers = _resolvers;
/**
 * Used to initialize new subschema for testing.  But also to override behaviours if necessary.
 *
 * @param defaultLoaders
 * @param defaultResolvers
 * @param defaultPropTypes
 * @param defaultInjectorFactory
 * @param Subschema
 */

export function newSubschemaContext(defaultLoaders = [],
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
                                        warning
                                    }) {
    warning(defaultValueManager, `A default ValueManager is required`);
    const {...rest} = Subschema;

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

export default ({
    Conditional,
    Content,
    ContentWrapper,
    Field,
    FieldSet,
    Form,
    ObjectType,
    Object: ObjectType,
    RenderContent,
    RenderTemplate,
    PropTypes,
    resolvers,
    cachedInjector,
    injectorFactory,
    loaderFactory,
    tutils,
    warning,
    newSubschemaContext
});
