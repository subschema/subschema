"use strict";

import React from 'react';
import tu, {noop} from '../tutils';
import CollectionMixin from './CollectionMixin.jsx';
import style from 'subschema-styles/List-style';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _get from 'lodash/object/get';
import map from 'lodash/collection/map';
import PropTypes from '../PropTypes';
import defaults from 'lodash/object/defaults';


export default class ListInput extends CollectionMixin {
    static inputClassName = CollectionMixin.inputClassName;

    static isContainer = true;

    static propTypes = CollectionMixin.propTypes;

    static defaultProps = CollectionMixin.defaultProps;


    unwrap(value) {
        return map(value, 'value');
    }


    newValue() {
        return {
            key: this.state.wrapped && this.state.wrapped.length || 0
        }
    }


    itemToString() {
        if (this.props.itemToString) return this.props.itemToString;
        else if (this.props.labelKey) {
            var labelKey = this.props.labelKey;
            return function (v) {
                return <span className={style.item}>{_get(v.value, labelKey, '')}</span>;
            }
        }
        return function (v) {
            return v.value;
        };
    }


    getTemplateItem() {
        var value = tu.isString(this.props.itemType) ? {
            type: this.props.itemType
        } : this.props.itemType || {};
        value.title = false;
        return {
            value,
            key: {title: false, template: false, type: 'Hidden'}
        };
    }
}