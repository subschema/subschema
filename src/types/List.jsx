var React = require('../react');
var Constants = require('../Constants');
var tu = require('../tutils');
var CollectionMixin = require('./CollectionMixin.jsx');
var css = require('../css');
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
            collectionCreateTemplate:this.collectionCreateTemplate

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
    cloneVal(val){
        return {
            value: tu.clone(val)
        }
    },
    itemToString(){
        if (this.props.itemToString) return this.props.itemToString;
        else if (this.props.labelKey) {
            var labelKey = this.props.labelKey;
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
            name: this.props.name,
            title: this.props.title,
            subSchema: {
                value: this.props.itemType
            },
            fields: ['value']
        };
    },
    render() {
        var {name, itemTemplate, itemType, errors, path,field, value} = this.props, item = (!itemType || tu.isString(itemType)) ? {
            type: itemType || 'Text',
            name: name
        } : itemType, ListItemTemplate = this.template(itemTemplate), values = this.state.wrapped || [], length = values.length;
        item.canReorder = this.props.canReorder;
        item.canDelete = this.props.canDelete;
        item.canEdit = this.props.canEdit;
        item.canAdd = this.props.canAdd;
        this._item = item;
        var err = this.state.errors || {};
        var itemToString = this.itemToString();
        return (<div className={css.forField(this, 'list-editor')}>
            {this.renderAdd()}
            <ul className={css.forField(this, ListInput.inputListClassName)}>
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