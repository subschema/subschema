"use strict";

import React from 'react';
import {isString} from '../tutils';
import CollectionMixin from './CollectionMixin';

export default class ListInput extends CollectionMixin {
    static inputClassName = CollectionMixin.inputClassName;


    createPid() {
        return this._length || 0;
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
