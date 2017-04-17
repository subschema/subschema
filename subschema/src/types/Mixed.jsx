"use strict";

import React from "react";
import CollectionMixin from "./CollectionMixin";
import {isString} from "../tutils";
import defaults from "lodash/defaults";
import PropTypes from "../PropTypes";
export default class MixedInput extends CollectionMixin {

    static propTypes = defaults({
        labelKey: PropTypes.string,
        keyType: PropTypes.typeDescription,
        valueType: PropTypes.typeDescription,
        value: PropTypes.value,
    }, CollectionMixin.propTypes);

    static defaultProps = defaults({
        value: {},
        newKeyPrefix: 'new_key',
        showKey: true,
        valueType: {type: 'Text'},
        keyType: {type: 'Text'}
    }, CollectionMixin.defaultProps);



    uniqueCheck = (value)=> {
        if (!value) {
            return null;
        }
        if (this.state.editPid == value) {
            return null;
        }
        if (value in this.props.value) {

            return {
                message: 'Keys must be unique'
            }

        }
        return null;
    };

    createPid() {
        return `${this.props.newKeyPrefix}${this._length}`;
    }

    createDefValue() {
        return {};
    }

    count(value) {
        return value ? Object.keys(value).length : 0;
    }

    renderRows() {
        const {value} = this.props;
        return value ? Object.keys(value).map((key, i)=>this.renderRow(value[key], null,  i, key), this) : null;
    }

    getTemplateItem(edit) {

        const {keyType, valueType, editType, itemType} = this.props;
        const type = edit ? editType || valueType || itemType : valueType || itemType;
        const key = keyType ? isString(keyType) ? {type: keyType} : keyType : {type: 'Text'};
        const value = isString(type) ? {type} : type || {};
        const schema = {
            key,
            value
        };

        (key.validators || (key.validators = [])).unshift('required', this.uniqueCheck);

        return schema;
    }


}
