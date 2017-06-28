import PropTypes from 'subschema-prop-types';
import { flattenFields, warning } from 'subschema-utils';
/**
 *  static propTypes    = {
        fields          : PropTypes.fields,
        path            : PropTypes.path,
        //If the component goes away do we unstash (restore values) or
        // clearStash
        unstashOnUnmount: PropTypes.bool
    };
 * @param value
 * @param key
 * @param props
 * @param valueManager
 * @param loader
 */
export function resolveFieldKey(key) {
    return (this.path && key != null) ? `${this.path}.${key}` : key;
}
export function extractFields(value, props) {
    if (value != null && typeof value !== 'boolean') {
        if (Array.isArray(value)) {
            return value;
        }
        return [value]
    }

    if (props.fields) {
        return props.fields.map(resolveFieldKey, props);
    }
    if (props.fieldsets) {
        return flattenFields(props).map(resolveFieldKey, props);
    }
    if (props.schema) {
        return Object.keys(props.schema).map(resolveFieldKey, props);
    }
    if (props.path) {
        return [resolveFieldKey.call(props, value) || props.path];
    }
}
function stash$resolver(value, key, props, { valueManager }) {
    const fields = extractFields(value, props);
    warning(fields, 'could not find any fields to stash for "%s" "%s"', key,
        value);

    const returnStash = () => {
        return this._stashId =
            valueManager.stash(props.path || this, fields);
    };

    returnStash();

    return returnStash;
};


export default function stash(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;


    Clazz::this.property(key, stash$resolver);
}
