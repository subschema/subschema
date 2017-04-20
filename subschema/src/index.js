import _ReactCSSReplaceTransition from "subschema-transitions/lib/ReactCSSReplaceTransition";
import _PropTypes from 'subschema-prop-types';
import _ValueManager from 'subschema-valuemanager';
import _processors from 'subschema-processors';
import _expression from 'subschema-expression';
import _transition from 'subschema-transitions';
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
import _warning from 'subschema-utils/warning';
import _eventable from 'subschema-valuemanager/lib/eventable';
import _DefaultLoader from './DefaultLoader';
import {_newSubschemaContext} from './core';
import _loaderFactory from 'subschema-loader';
import {stringInjector as _stringInjector, injectorFactory as _injectorFactory} from 'subschema-injection';
import {transitions as _transitions} from 'subschema-transistions';
export const stringInjector = _stringInjector;
export const injectorFactory = _injectorFactory;
export const RenderTemplate = _RenderTemplate;
export const RenderContent = _RenderContent;
export const loaderFactory = _loaderFactory;
export const Conditional = _Conditional;
export const Field = _Field;
export const FieldSet = _FieldSet;
export const Form = _Form;
export const Dom = _Dom;
export const PropTypes = _PropTypes;
export const ValueManager = _ValueManager;
export const css = _css;
export const eventable = _eventable;
export const tutils = _tutils;
export const validators = _validators;
export const warning = _warning;
export const transitions = _transitions;
export const templates = _templates;
export const types = _types;
export const processors = _processors;
export const styles = _styles;
export const DefaultLoader = _DefaultLoader;
export const resolvers = _resolvers;
export const ReactCSSReplaceTransition = _ReactCSSReplaceTransition;

const _initSubchemaContext = _newSubschemaContext();
export const loader = _initSubchemaContext.loader;
export const injector = injectorFactory();
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