import _ValueManager from 'subschema-valuemanager';
import loaderFactory from 'subschema-loader';
import {injectorFactory} from 'subschema-injection';
import _PropTypes from 'subschema-prop-types';
import _resolvers from 'subschema-core/lib/resolvers';
import __Form from 'subschema-core/lib/Form';
import _validators from 'subschema-validators';
import {types as _types, templates as _templates} from 'subschema-component-form';
import styles from '../styles';
import * as _processors from 'subschema-processors';
import {styles as transitions} from 'subschema-transition';
const newSubschemaContext = (opts) => {
    let {
        valueManager,
        ValueManager = _ValueManager,
        loader = loaderFactory(),
        injector = injectorFactory(),
        propTypes = _PropTypes,
        resolvers = _resolvers,
        _Form = __Form,
        validators = _validators,
        types = _types,
        templates = _templates,
        processors = _processors
    } = opts || {};

    class Form extends _Form {
        static defaultValueManager = ValueManager;
    }
    Object.keys(resolvers).forEach(key => {
        if (key in propTypes) {
            injector.resolver(propTypes[key], resolvers[key]);
        }
    });
    loader.addTemplate(templates);
    loader.addValidator(validators);
    loader.addType(types);
    loader.addStyle(styles);
    loader.addTransition(transitions);
    loader.addProcessor(processors);
    if (!valueManager) {
        valueManager = ValueManager();
    }
    Form.defaultProps.injector = injector;
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