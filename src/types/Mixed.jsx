import React from "react";
import CollectionMixin from "./CollectionMixin";
import {isString} from "../tutils";
import defaults from "lodash/object/defaults";
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

    static injectedProps = {
        value: "."
    };


    uniqueCheck = (value)=> {
        var values = this.props.value;
        if (!value){
            return null;
        }
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
        return `${this.props.newKeyPrefix}${this._length}`;
    }

    createDefValue() {
        return {};
    }
    count(value){
        return value ? Object.keys(value).length : 0;
    }
    renderRows() {
        const {value} = this.props;
        return Object.keys(value).map((key, i)=>this.renderRowEach(value[key], i, key), this)
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
