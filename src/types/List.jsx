var React = require('react'), Constants = require('../Constants');


var _ = require('lodash');
var tu = require('../tutils');
var CollectionMixin = require('./CollectionMixin.jsx');
var loader = require('../loader.jsx');
var ListInput = React.createClass({
    mixins: [CollectionMixin],
    getDefaultProps() {
        return {

            title: '',
            placeholder: '',
            itemType: 'Text',
            onValueChange() {
            },
            onValidate() {
            },
            itemTemplate: 'ListItemTemplate',
            collectionCreateTemplate:this.collectionCreateTemplate

        }
    },
    /*
     extractValue(v) {
     return v.value;
     },
     wrap(prop){
     return {wrapped: prop && prop.value && prop.value.map(this.toValues) || []};
     },
     toValues(value, id) {
     return {
     id, value
     }
     },
     */
    unwrap(value) {
        var ret = (value || []).map(function (v, i) {
            return v && v.value && v.value.value;
        });
        return ret;
    },

    wrap(prop){
        var value = prop && prop.value || [];
        var wrapped = value.map(function (v, k) {
            return {
                id: k,
                value: {
                    value: value[k]
                }
            }
        });
        return {
            wrapped
        };
    },
    cloneVal(val){
        return {
            value: _.clone(val)
        }
    },
    itemToString(){
        if (this.props.itemToString) return this.props.itemToString;
        else if (this.props.field.labelKey) {
            var labelKey = this.props.field.labelKey;
            return function (v) {
                if (!(v)) {
                    return null;
                }
                return <span className="brf-value list-group-item-text">{v[labelKey] || ''}</span>;
            }
        }
        return function (v) {
            return v && v.toString();
        };
    },
    /* unwrap:function(value){
     if (value == null) return [];
     return value.map(this.extractValue);
     },*/
    getTemplateItem(){
        return {
            type: 'Object',
            name: this.props.field.name,
            title: this.props.field.title,
            subSchema: {
                value: this.props.field.itemType || this.props.itemType
            },
            fields: ['value']
        };
    },
    render() {
        var {name, itemTemplate, itemType, errors, path,field} = this.props, item = (!itemType || _.isString(itemType)) ? {
            type: itemType || 'Text',
            name: name
        } : itemType, ListItemTemplate = loader.loadTemplate(itemTemplate), values = this.state.wrapped || [], length = values.length;
        item.canReorder = field.canReorder;
        item.canDelete = field.canDelete;
        item.canEdit = field.canEdit;
        item.canAdd = field.canAdd;
        this._item = item;
        var err = this.state.errors || {};
        var itemToString = this.itemToString();
        return (<div className={Constants.clz(ListInput.inputClassName, this.props.editorClass, 'list-editor')}>
            {this.renderAdd()}
            <ul className={Constants.clz(ListInput.inputListClassName)}>
                {values.map((v, i) => {
                    var lipath = tu.path(path, v.id);
                    return <ListItemTemplate ref={name+'_'+i} key={'li-' + name + '-' + v.id} pos={i}
                                             onMoveUp={this.handleMoveUp}
                                             itemToString={itemToString}
                                             onMoveDown={this.handleMoveDown} onDelete={this.handleDelete}
                                             onEdit={this.handleEdit}
                                             field={item}
                                             path={lipath}
                                             errors={err && err[lipath]}
                                             pid={v.id}
                                             value={v.value.value} last={i + 1 === length}/>
                })}
            </ul>
        </div>);
    }

});
module.exports = ListInput;