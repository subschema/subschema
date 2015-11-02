"use strict";

var React = require('../react');
var Constants = require('../Constants');
var tu = require('../tutils');
var CollectionMixin = require('./CollectionMixin.jsx');
var css = require('../css');
var style = require('../styles/List-style');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var _get = require('lodash/object/get');
var map = require('lodash/collection/map');
var PropTypes = require('../PropTypes');
var ListInput = React.createClass({
    mixins: [CollectionMixin],
    propTypes:{
      'labelKey':PropTypes.path
    },
    getDefaultProps() {
        return {

            title: '',
            placeholder: '',
            onValidate() {},
            itemTemplate: 'ListItemTemplate',
            collectionCreateTemplate: this.collectionCreateTemplate
        }
    },

    unwrap(value) {
        return map(value, 'value');
    },
    newValue(){
        return {
            key: this.state.wrapped && this.state.wrapped.length || 0
        }
    },
    itemToString(){
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
    },

    getTemplateItem(){
        var action = this.state.editPid != null ? 'edit' : 'save';
        var value = tu.isString(this.props.itemType) ? {
            type: this.props.itemType
        } : this.props.itemType;
        value.title = false;
        return {
            schema: {
                value,
                key: {title: false, template: false, type: 'Hidden'}
            },
            fieldsets: [{
                fields: ['value', 'key'],
                buttons: {
                    buttonsClass: 'btn-group pull-right',
                    buttons: [{label: 'Cancel', action: 'cancel', buttonClass: 'btn btn-default'}
                        , {label: 'Save', type: 'submit', action: 'submit', buttonClass: 'btn-primary btn'}]
                }
            }]

        };


    }
});
module.exports = ListInput;