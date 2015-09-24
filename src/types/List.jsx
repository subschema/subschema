var React = require('../react');
var Constants = require('../Constants');
var tu = require('../tutils');
var CollectionMixin = require('./CollectionMixin.jsx');
var css = require('../css');
var ReactCSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;
require('../styles/transitions.less');
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
            collectionCreateTemplate: this.collectionCreateTemplate

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

    getTemplateItem(){
        var action = this.state.editPid != null ? 'edit' : 'save';
        var value = tu.isString(this.props.itemType) ? {
            type: this.props.itemType
        } : this.props.itemType;
        value.title = false;
        return {
            type: 'Object',
            name: this.props.name,
            title: false,

            subSchema: {
                value
            },
            fieldsets: [{
                fields: ['value'],
                buttons: {
                    onClick: this.handleBtnGroup,
                    buttonsClass: 'btn-group pull-right',
                    buttons: [{label: 'Cancel', action: 'cancel', buttonClass: 'btn btn-default'}
                        , {label: 'Save', action: action, buttonClass: 'btn-primary btn'}]
                }
            }]
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
            <ReactCSSTransitionGroup component="ul" transitionName="transition_scale"
                                     className={css.forField(this, ListInput.inputListClassName)}
                                     transitionAppear={true} transitionLeave={true}>
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
                                             value={v.value.value} last={i + 1 === length}>
                        {this.props.inline && this.state.editPid === v.id ? this.renderAddEditTemplate(v, false) : null}
                    </ListItemTemplate>
                })}
            </ReactCSSTransitionGroup>
        </div>);
    }

});
module.exports = ListInput;