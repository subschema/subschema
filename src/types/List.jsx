var React = require('../react');
var Constants = require('../Constants');
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
            onValidate() {
            },
            itemTemplate: 'ListItemTemplate',
            itemToString: 'ItemToStringTemplate',
            template: 'ListTemplate',
            collectionCreateTemplate: this.collectionCreateTemplate,
            valueProp: 'value'

        }
    },

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

    itemToString(){
        var Template = this.template('itemToString'), field = this.props.field;
        return function List$itemToString(v) {
            return <Template {...field} value={v}/>
        }
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
        var {name, itemType, errors, path,field} = this.props, item = (!itemType || tu.isString(itemType)) ? {
            type: itemType || 'Text',
            name: name
        } : itemType, ListItemTemplate = this.template('itemTemplate'), values = this.state.wrapped || [], length = values.length;
        item.canReorder = field.canReorder;
        item.canDelete = field.canDelete;
        item.canEdit = field.canEdit;
        item.canAdd = field.canAdd;
        var err = this.state.errors || {};
        var itemToString = this.itemToString();
        var Template = this.template();
        return (<Template renderAdd={this.renderAdd()}>
            {values.map((v, i) => {
                var lipath = tu.path(path, v.id);
                return <ListItemTemplate ref={name+'_'+i} key={'li-' + name + '-' + v.id} pos={i}
                                         onMoveUp={this.handleMoveUp}
                                         itemToString={itemToString}
                                         onMoveDown={this.handleMoveDown} onDelete={this.handleDelete}
                                         onEdit={this.handleEdit}
                                         field={item}
                                         path={lipath}
                                         valueProp={this.props.valueProp}
                                         errors={err && err[lipath]}
                                         pid={v.id}
                                         value={v.value.value} last={i + 1 === length}/>
            })}
        </Template>);
    }

});
module.exports = ListInput;