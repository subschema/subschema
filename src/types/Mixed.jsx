var React = require('../react');
var CollectionMixin = require('./CollectionMixin.jsx');
var tu = require('../tutils');
var Constants = require('../Constants');
var css = require('../css');
var style = require('./Mixed-style');
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
    cloneVal(value){
        return value
    },
    unwrap(value) {
        var ret = {}
        if (value == null) {
            return ret;
        }
        value.forEach(function (v) {
            v = v.value;
            ret[v.key] = v.value;
        });
        return ret;
    },

    wrap(prop){
        var value = prop && prop.value || {};
        var wrapped = Object.keys(value).map(function (k) {
            return {
                id: k,
                value: {
                    key: k,
                    value: value[k]
                }
            }
        });
        return {
            wrapped
        };
    },
    itemToString(){
        if (this.props.itemToString) return this.props.itemToString;
        var labelKey = this.props.field.labelKey;
        return function (v) {
            if (!(v && v.key)) {
                return null;
            }

            return <span><h4 className={style.item}>{v.key}</h4>{labelKey ? <span
                className={style.itemInner}>{ v.value[labelKey]}</span> : null}</span>;
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
    getTemplateItem(){
        var kt = this.props.field.keyType,
            action = this.state.editPid != null ? 'edit' : 'save',
            keyType = tu.isString(kt) ? {
                type: kt
            } : kt || {},
            validators = keyType.validators || (keyType.validators = []),
            item = {
                type: 'Object',
                name: this.props.field.name,
                subSchema: {
                    key: keyType,
                    value: this.props.field.valueType || this.props.valueType
                },
                fieldsets: [{
                    fields: ['key', 'value'],
                    buttons: {
                        onClick: this.handleBtnGroup,
                        buttonsClass: style.buttonsClass,
                        buttons: [{label: 'Cancel', action: 'cancel', buttonClass:style.buttonCancel}
                            , {label: 'Save', action: action, buttonClass: style.buttonSave}]
                    }
                }]
            };

        if (!keyType.type) {
            keyType.type = this.props.keyType;
        }

        validators.unshift('required', this.uniqueCheck);

        return item;
    },
    render() {
        var {name,  itemType, errors, canReorder, canDelete, canEdit, canAdd, path,field} = this.props, item = (!itemType || tu.isString(itemType)) ? {
            type: itemType || 'Text',
            name: name
        } : itemType, ListItemTemplate = this.template('itemTemplate'), values = this.state.wrapped || [], length = values.length;
        item.canReorder = canReorder;
        item.canDelete = canDelete;
        item.canEdit = canEdit;
        var itemToString = this.itemToString();
        return (<div className={css.forField(this, 'list-editor')}>
            {this.renderAdd()}
            <ul>
                {values.map((v, i) => {
                    var path = tu.path(path, v.id);
                    return <ListItemTemplate key={path} pos={i} path={path}
                                             onMoveUp={this.handleMoveUp}
                                             onMoveDown={this.handleMoveDown} onDelete={this.handleDelete}
                                             onEdit={this.handleEdit}

                                             field={item}
                                             pid={v.id}
                                             itemToString={itemToString}
                                             value={v.value} errors={errors} last={i + 1 === length}>
                        {this.props.inline && this.state.editPid === v.id ? this.renderAddEditTemplate(v, false) : null}
                    </ListItemTemplate>
                })}
            </ul>
        </div>);
    }

});

module.exports = MixedInput;