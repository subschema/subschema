import React from 'react';
import CollectionMixin from './CollectionMixin.jsx';
import {isString} from '../tutils';
import style from 'subschema-styles/Mixed-style';
import _get from 'lodash/object/get';
import defaults from 'lodash/object/defaults';
import PropTypes from '../PropTypes';
export default class MixedInput extends CollectionMixin {

    static propTypes = defaults({
        labelKey: PropTypes.string,
        keyType: PropTypes.typeDescription,
        valueType: PropTypes.typeDescription,
        value: PropTypes.value,
    }, CollectionMixin.propTypes);

    static defaultProps = defaults({
        newKeyPrefix: 'new_key',
        showKey: true,
        valueType: {type: 'Text'},
        keyType: {type: 'Text'}
    }, CollectionMixin.defaultProps);

    unwrap(value) {
        var ret = {}
        if (value == null) {
            return ret;
        }
        value.forEach(function (v) {
            ret[v.key] = v.value;
        });
        return ret;
    }

    uniqueCheck = (value)=> {
        var values = this.getValue();
        if (this.state.editPid == value) {
            return null;
        }
        if (value in values) {

            return {
                message: 'Keys must be unique'
            }

        }
        return null;
    };

    createPid() {
        return `${this.props.newKeyPrefix}${this.state.wrapped.length}`;
    }

    createDefValue() {
        return {};
    }

    getTemplateItem() {
        let {keyType, valueType, itemType} = this.props;

        keyType = keyType ? isString(keyType) ? {type: keyType} : keyType : {type: 'Text'};

        const schema = {
            key: isString(keyType) ? {keyType} : keyType,
            value: valueType || itemType
        };

        (keyType.validators || (keyType.validators = [])).unshift('required', this.uniqueCheck);

        return schema;
    }


}
