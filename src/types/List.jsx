"use strict";

import React from 'react';
import {noop, isString} from '../tutils';
import CollectionMixin from './CollectionMixin.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _get from 'lodash/object/get';
import map from 'lodash/collection/map';
import PropTypes from '../PropTypes';
import defaults from 'lodash/object/defaults';


export default class ListInput extends CollectionMixin {
    static inputClassName = CollectionMixin.inputClassName;



    unwrap(value) {
        return map(value, 'value');
    }

    createDefValue() {
        return [];
    }

    createPid() {
        return this.state.wrapped.length || 0;
    }

    getTemplateItem() {
        var value = isString(this.props.itemType) ? {
            type: this.props.itemType
        } : this.props.itemType || {};
        value.title = false;
        return {
            value,
            key: {title: false, template: false, type: 'Hidden'}
        };
    }
}