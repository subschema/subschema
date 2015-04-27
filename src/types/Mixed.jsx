var React = require('../react');
var CollectionMixin = require('./CollectionMixin.jsx');
var tu = require('../tutils');
var loader = require('../loader.jsx');
var Constants = require('../Constants');
var MixedInput = React.createClass({
    mixins: [CollectionMixin],
    getDefaultProps() {
        return {
            placeholder: '',
            itemType: 'Text',
            keyType: 'Text',
            valueType: 'Text',
            onValueChange() {
            },
            onValidate() {
            },
            itemTemplate: this.itemTemplate,
            collectionCreateTemplate: this.collectionCreateTemplate
        }
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

            return <span><h4 className="brf-key list-group-item-heading">{v.key}</h4>{labelKey ? <span
                className="brf-value list-group-item-text">{ v.value[labelKey]}</span> : null}</span>;
        }

    },
    cloneVal(val){
        return tu.clone(val)

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
                fields: ['key', 'value']
            };

        if (!keyType.type) {
            keyType.type = this.props.keyType;
        }

        validators.unshift('required', this.uniqueCheck);

        return item;
    },
    render() {
        var {name, itemTemplate, itemType, errors, path,field} = this.props, item = (!itemType || tu.isString(itemType)) ? {
            type: itemType || 'Text',
            name: name
        } : itemType, ListItemTemplate = loader.loadTemplate(itemTemplate), values = this.state.wrapped || [], length = values.length;
        item.canReorder = field.canReorder;
        item.canDelete = field.canDelete;
        item.canEdit = field.canEdit;
        var itemToString = this.itemToString();
        return (<div className={Constants.clz(MixedInput.inputClassName, this.props.editorClass, 'list-editor')}>
            {this.renderAdd()}
            <ul className={Constants.clz(MixedInput.inputListClassName)}>
                {values.map((v, i) => {
                    var path = tu.path(path, v.id);
                    return <ListItemTemplate key={path} pos={i} path={path}
                                             onMoveUp={this.handleMoveUp}
                                             onMoveDown={this.handleMoveDown} onDelete={this.handleDelete}
                                             onEdit={this.handleEdit}
                                             field={item}
                                             pid={v.id}
                                             itemToString={itemToString}
                                             value={v.value} errors={errors} last={i + 1 === length}/>
                })}
            </ul>
        </div>);
    }

});

module.exports = MixedInput;