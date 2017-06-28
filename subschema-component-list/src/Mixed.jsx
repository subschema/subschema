import React from 'react';
import CollectionMixin from './CollectionMixin';
import { isString } from 'subschema-utils';
import PropTypes from 'subschema-prop-types';

export default class MixedInput extends CollectionMixin {

    static propTypes = {
        ...CollectionMixin.propTypes,
        labelKey : PropTypes.string,
        keyType  : PropTypes.typeDescription,
        valueType: PropTypes.typeDescription,
        showKey  : PropTypes.bool,

    };

    static defaultProps = {
        ...CollectionMixin.defaultProps,
        value       : {},
        newKeyPrefix: 'new_key',
        showKey     : true,
        valueType   : { type: 'Text' },
        keyType     : { type: 'Text' }
    };


    uniqueCheck = (value) => {
        if (!value) {
            return null;
        }
        if (this.props.editPid != null && this.props.editPid.key == value) {
            return null;
        }
        if (value in this.props.value) {

            return {
                message: 'Keys must be unique'
            }

        }
        return null;
    };

    count() {
        if (!this.props.value) {
            return 0;
        }
        return Object.keys(this.props.value).length;
    }

    createPid() {
        return `${this.props.newKeyPrefix}${this.count()}`;
    }

    createDefValue() {
        return {};
    }

    renderRows() {
        const { value } = this.props;
        return value ? Object.keys(value).map(function (key, i) {
            return this.renderRow(value[key], null, i, key)
        }, this) : null;
    }

    getTemplateItem(edit) {

        const {
                  keyType = { type: 'Text' }, valueType,
                  editType, itemType
              }    = this.props;
        const type = edit ? editType
                            || valueType
                            || itemType
            : valueType || itemType;

        const key = isString(keyType) ? { type: keyType } : keyType;

        const value = isString(type) ? { type } : type || {};

        const schema = { key, value };

        (key.validators || (key.validators = [])).unshift('required',
            this.uniqueCheck);

        return schema;
    }


}
