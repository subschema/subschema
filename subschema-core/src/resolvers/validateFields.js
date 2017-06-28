import { extractFields } from './stash';
import PropTypes from 'subschema-prop-types';

function validateFields$resolver(value, key, props, { valueManager }) {
    const fields = extractFields(value, props);

    return () => {
        const r = valueManager.validatePaths(fields);
        return r;
    }

}

export default function validateFields(Clazz, key) {


    Clazz.contextTypes.valueManager = PropTypes.valueManager;


    Clazz::this.property(key, validateFields$resolver);
}
