import React from 'react';
import { isString } from 'subschema-utils';
import CollectionMixin from './CollectionMixin';
import PropTypes from 'subschema-prop-types';

export default class ListInput extends CollectionMixin {
    static inputClassName = CollectionMixin.inputClassName;
    static propTypes      = {
        ...CollectionMixin.propTypes,
        canReorder: PropTypes.bool,
    };

    createPid() {
        return this.count();
    }

    createDefValue() {
        return [];
    }
    handleMoveUp = (pos, val) => {
        this.reorder(pos, val, -1);
    };

    handleMoveDown = (pos, val) => {
        this.reorder(pos, val, 1);
    };

    renderRows() {
        if (this.props.value) {
            return this.props.value.map(this.renderRowEach, this);
        }
        return null;
    }
    count() {
        if (!this.props.value) {
            return 0;
        }
        return this.props.value.length;
    }

    reorder(pos, val, direction) {
        const values = clone(this.props.value);
        const newPos = direction > 0 ? Math.min(pos + direction, values.length)
            : Math.max(pos + direction, 0);
        if (this.props.onWillReorder(pos, val, direction) !== false) {
            values.splice(newPos, 0, values.splice(pos, 1)[0]);
            this.props.onChange(values);
        }
    }

    getTemplateItem(edit) {
        const type  = edit ? this.props.editType || this.props.itemType
            : this.props.itemType;
        const value = isString(type) ? {
            type
        } : type || {};
        value.title = false;
        return {
            value,
            key: { title: false, template: false, type: 'Hidden' }
        };
    }
}
