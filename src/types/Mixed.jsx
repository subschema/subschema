import React from 'react';
import CollectionMixin from './CollectionMixin.jsx';
import {isString} from '../tutils';
import style from 'subschema-styles/Mixed-style';
import _get from 'lodash/object/get';
import defaults from 'lodash/object/defaults';
import PropTypes from '../PropTypes';

export default class MixedInput extends CollectionMixin {
    static isContainer = true;
    static propTypes = defaults({
        labelKey: PropTypes.string,
        keyType: PropTypes.schema,
        value: PropTypes.object

    }, CollectionMixin.propTypes);

    static defaultProps = defaults({
        valueType:{type: 'Text'},
        keyType: {type: 'Text'},
    }, CollectionMixin.defaultProps)

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

    itemToString() {
        if (this.props.itemToString) return this.props.itemToString;
        var labelKey = this.props.labelKey;
        return function (v) {
            if (!(v && v.key)) {
                return null;
            }

            return <span><h4 className={style.item}>{v.key}</h4>{labelKey ? <span
                className={style.itemInner}>{ _get(v.value, labelKey, '')}</span> : null}</span>;
        }

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
    }

    newValue() {
        return {}
    }

    getTemplateItem() {
        var kt = this.props.keyType,
            keyType = isString(kt) ? {
                type: kt
            } : kt || {},
            schema = {
                key: keyType,
                value: this.props.itemType
            };

        if (!keyType.type) {
            keyType.type = this.props.keyType;
        }

        (keyType.validators || (keyType.validators = [])).unshift('required', this.uniqueCheck);

        return schema;
    }


}
