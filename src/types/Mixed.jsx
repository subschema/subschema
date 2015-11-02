var React = require('../react');
var CollectionMixin = require('./CollectionMixin.jsx');
var tu = require('../tutils');
var Constants = require('../Constants');
var css = require('../css');
var style = require('../styles/Mixed-style');
var _get = require('lodash/object/get');

var MixedInput = React.createClass({
    mixins: [CollectionMixin],
    statics: {},
    getDefaultProps() {
        return {
            placeholder: '',
            itemType: 'Text',
            keyType: 'Text',
            valueType: 'Text',
            itemTemplate: 'ListItemTemplate',

            onValidate() {
            }

        }
    },

    unwrap(value) {
        var ret = {}
        if (value == null) {
            return ret;
        }
        value.forEach(function (v) {
            ret[v.key] = v.value;
        });
        return ret;
    },

    itemToString(){
        if (this.props.itemToString) return this.props.itemToString;
        var labelKey = this.props.field.labelKey;
        return function (v) {
            if (!(v && v.key)) {
                return null;
            }

            return <span><h4 className={style.item}>{v.key}</h4>{labelKey ? <span
                className={style.itemInner}>{ _get(v.value, labelKey, '')}</span> : null}</span>;
        }

    },

    uniqueCheck(value){
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
    },
    newValue(){
        return {}
    },
    getTemplateItem(){
        var kt = this.props.field.keyType,
            action = this.state.editPid != null ? 'edit' : 'save',
            keyType = tu.isString(kt) ? {
                type: kt
            } : kt || {},
            validators = keyType.validators || (keyType.validators = []),
            item = {
                schema: {
                    key: keyType,
                    value: this.props.field.valueType || this.props.valueType
                },
                fieldsets: [{
                    fields: ['key', 'value'],
                    buttons: {
                        buttonsClass: style.buttonsClass,
                        buttons: [{label: 'Cancel', action: 'cancel', buttonType: 'a', buttonClass: style.buttonCancel}
                            , {label: 'Save', action: 'submit', type: 'submit', buttonClass: style.buttonSave}]
                    }
                }]
            };

        if (!keyType.type) {
            keyType.type = this.props.keyType;
        }

        validators.unshift('required', this.uniqueCheck);

        return item;
    },

});

module.exports = MixedInput;