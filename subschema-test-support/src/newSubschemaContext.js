import _ValueManager from 'subschema-valuemanager';
import loaderFactory from 'subschema-loader';
import {injectorFactory} from 'subschema-injection';
import _PropTypes from 'subschema-prop-types';
import _resolvers from 'subschema-core/lib/resolvers';
import __Form from 'subschema-core/lib/Form';
import _validators from 'subschema-validators';
import {types as _types, templates as _templates} from 'subschema-component-form';
import * as _processors from 'subschema-processors';
import {transitions} from 'subschema-transitions';
import bootstrap from 'subschema-css-bootstrap';

const newSubschemaContext = (opts) => {
    let {
        valueManager,
        ValueManager = _ValueManager,
        loader = loaderFactory(),
        _injectorFactory = injectorFactory,
        propTypes = _PropTypes,
        resolvers = _resolvers,
        Form = __Form,
        validators = _validators,
        types = _types,
        templates = _templates,
        processors = _processors,
        styles = {}
    } = opts || {};


    const injector = _injectorFactory(loader);
    loader.addResolver(propTypes, resolvers);
    loader.addLoader(bootstrap);
    loader.addTemplate(templates);
    loader.addLoader(validators);
    loader.addType(types);
    loader.addStyle(styles);
    loader.addTransition(transitions);
    loader.addProcessor(processors);
    if (!valueManager) {
        valueManager = ValueManager();
    }
    Form.defaultValueManager = ValueManager;
    Form.defaultProps.injector = _injectorFactory;
    Form.defaultProps.loader = loader;
    return {
        Form,
        valueManager,
        ValueManager,
        injector,
        loader,
        context: {
            valueManager,
            injector,
            loader
        }
    }
};

export default newSubschemaContext;
