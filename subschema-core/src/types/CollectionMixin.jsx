"use strict";

import React, {Component} from "react";
import {path, noop, clone} from "../tutils";
import UninjectedObjectType from "./Object";
import PropTypes from "../PropTypes";
import defaults from "lodash/defaults";
import RenderTemplate from "../components/RenderTemplate";

function makeEditPid(path, pid) {
    return '@' + path.replace(/\./g, '@') + (pid != null ? `@${pid}` : '');
}

function remove(obj, key) {
    if (!obj) return;
    if (Array.isArray(obj)) {
        obj.splice(key, 1);

    } else {
        delete obj[key];
    }
    return obj;
}

export default class CollectionMixin extends Component {


    static inputClassName = 'list-editor';

    static contextTypes = {valueManager: PropTypes.valueManager};

    static propTypes = {
        onChange: PropTypes.valueEvent,
        path: PropTypes.path,
        showAdd: PropTypes.bool,
        canEdit: PropTypes.bool,
        canReorder: PropTypes.bool,
        canDelete: PropTypes.bool,
        canAdd: PropTypes.bool,
        showKey: PropTypes.bool,
        inline: PropTypes.bool,
        labelKey: PropTypes.string,
        itemType: PropTypes.typeDescription,
        editType: PropTypes.typeDescription,
        createType: PropTypes.typeDescription,
        editTemplate: PropTypes.template,
        createTemplate: PropTypes.template,
        buttonTemplate: PropTypes.template,
        itemTemplate: PropTypes.template,
        contentTemplate: PropTypes.template,
        buttons: PropTypes.buttons,
        addButton: PropTypes.button,
        listContainerClass: PropTypes.cssClass,
        ObjectType: PropTypes.injectClass,
        value: PropTypes.value,
        title: PropTypes.title
    };

    static defaultProps = {
        onWillReorder: noop,
        onWillChange: noop,
        onWillAdd: noop,
        onWillDelete: noop,
        createTemplate: 'CollectionCreateTemplate',
        editTemplate: 'CollectionCreateTemplate',
        buttonTemplate: 'ButtonTemplate',
        itemTemplate: 'ListItemTemplate',
        contentTemplate: "ContentItemTemplate",
        showKey: false,
        showAdd: false,
        itemType: {
            type: 'Text'
        },
        addButton: {
            "label": "Add",
            "className": "btn btn-default btn-add"
        },
        buttons: {
            buttonsClass: 'btn-group pull-right',
            buttons: [{label: 'Cancel', action: 'cancel', buttonClass: 'btn btn-default'}
                , {label: 'Save', type: 'submit', action: 'submit', buttonClass: 'btn-primary btn'}]
        },
        ObjectType: UninjectedObjectType
    };
    state = {
        showAdd: this.props.showAdd
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        this._length = this.count(props.value);
    }

    componentWillReceiveProps(props) {
        const {showAdd} = props;
        if (showAdd !== this.props.showAdd) {
            this.setState({showAdd});
        }
        this._length = this.count(props.value);
    }

    count(value) {
        return value ? value.length : 0;
    }

    getValue() {
        return this.props.value;
    }


    setErrors(errors) {
        this.setState({errors});
    }

    handleMoveUp = (pos, val) => {
        this.reorder(pos, val, -1);
    };

    handleMoveDown = (pos, val)=> {
        this.reorder(pos, val, 1);
    };

    reorder(pos, val, direction) {
        const values = this.props.value, oval = values && values.concat();
        const newPos = direction > 0 ? Math.min(pos + direction, values.length) : Math.max(pos + direction, 0);
        if (this.props.onWillReorder(pos, val, direction) !== false) {
            values.splice(newPos, 0, values.splice(pos, 1)[0]);
            this.changeValue(values, oval);
        }
    }

    handleDelete = (pos, val, pid)=> {
        const values = this.props.value, oval = values && values.concat();
        if (this.props.onWillDelete(pos, val) !== false) {
            values.splice(pos, 1);
            this.changeValue(values, oval);
        }
    };


    changeValue = (newValue, oldValue)=> {
        if (this.props.onChange(newValue) !== false) {
            this.setState({
                showAdd: this.props.showAdd,
                showEdit: false
            });
        }
    };

    handleAddBtn = (e)=> {
        e && e.preventDefault();
        const key = this.createPid();
        this.context.valueManager.update(makeEditPid(this.props.path, key), {
            key
        });
        this.setState({showAdd: true, editPid: key});
    };

    handleEdit = (pos, val, pid) => {
        this.context.valueManager.update(makeEditPid(this.props.path, pid), {
            value: clone(val),
            key: pid
        });
        this.setState({
            showAdd: false,
            showEdit: true,
            editPid: pid
        });
    };


    handleCancelAdd = (e) => {
        e && e.preventDefault();
        this.setState({showAdd: this.props.showAdd, showEdit: false});
    };

    handleBtnClick = (e, action)=> {
        e && e.preventDefault();

        if (action == 'submit') {
            this.handleSubmit(e);

        } else {
            this.context.valueManager.update(makeEditPid(this.props.path, this.state.editPid));
            this.setState({
                showAdd: this.props.showAdd,
                showEdit: false,
                editPid: null
            });
        }
    };

    handleSubmit = (e)=> {
        e && e.preventDefault();
        var {valueManager} = this.context;
        var origKey = makeEditPid(this.props.path, this.state.editPid);
        const origValue = valueManager.path(origKey) || {};
        var {
            key,
            value
        } = origValue;
        const errors = valueManager.getErrors();

        if (errors == null || Object.keys(errors).length === 0) {
            var currentPath = path(this.props.path, key);
            //value fix.
            var clonedValue = !this.props.value ? this.createDefValue() : clone(this.props.value);
            if (!this.props.onSubmit || this.props.onSubmit(e, errors, value, currentPath) !== false) {
                if (key) {
                    clonedValue[key] = value;
                    //if the key changed, remove the original.
                    if (origKey !== makeEditPid(currentPath)) {
                        remove(clonedValue, this.state.editPid);
                    }
                } else {
                    clonedValue.unshift(value);
                }
                valueManager.update(origKey);

                this.props.onChange(clonedValue);
            }

            //return false;
        } else {
            return false;
        }

        this.setState({
            showAdd: this.props.showAdd,
            showEdit: false,
            editPid: null
        });
    };


    renderAddEditTemplate(edit, create) {
        if (!(edit || create)) {
            return null;
        }
        const childPath = path(this.props.path, this.state.editPid);
        const {ObjectType, editTemplate, createTemplate} = this.props;
        return (
            <RenderTemplate template={edit ? editTemplate : createTemplate} inline={edit ? this.props.inline : false}
                            create={edit ? false : create}
                            title={this.props.title} key="addEditTemplate">
                <ObjectType key="addEdit"
                            onButtonClick={this.handleBtnClick}
                            schema={this.createItemSchema(childPath, edit)}
                            path={makeEditPid(this.props.path,this.state.editPid)}
                />
            </RenderTemplate>);
    }

    renderAddBtn() {
        if (!this.props.canAdd) {
            return null;
        }
        const btn = defaults({}, this.props.addButton, CollectionMixin.defaultProps.addButton);
        return <RenderTemplate template={this.props.buttonTemplate} key="addBtn"  {...btn}
                               onClick={this.handleAddBtn}
                               iconClass={this.props.iconAddClass}/>

    }

    renderAdd() {
        if (!(this.props.canAdd || this.props.canEdit)) {
            return null;
        }
        const {showAdd, showEdit} = this.state;
        if (this.props.inline) {
            if (showAdd) {
                return this.renderAddEditTemplate(false, true);
            } else {
                return this.renderAddBtn();
            }
        } else if (!(showAdd || showEdit)) {
            return this.renderAddBtn();
        }
        return this.renderAddEditTemplate(showEdit, showAdd);
    }

    createItemSchema(edit) {
        const schema = {
            schema: this.getTemplateItem(edit),
            fieldsets: [{
                fields: ['key', 'value'],
                buttons: this.props.buttons
            }]

        };
        return schema;
    }

    renderRowEach(data, rowId) {
        return this.renderRow(data, null, rowId, rowId);
    }

    renderRows() {
        if (this.props.value) {
            return this.props.value.map(this.renderRowEach, this);
        }
        return null;
    }

    renderRow(value, sectionId, pos, key) {
        const {itemTemplate, contentTemplate} = this.props;
        const v = {value};
        return <RenderTemplate template={itemTemplate}
                               key={this.props.path+'.'+pos}
                               pos={pos}
                               path={ path(this.props.path, key)}
                               onMoveUp={this.handleMoveUp}
                               onMoveDown={this.handleMoveDown}
                               onDelete={this.handleDelete}
                               onEdit={this.handleEdit}
                               canReorder={this.props.canReorder}
                               canDelete={this.props.canDelete}
                               canEdit={this.props.canEdit}
                               value={v}
                               last={pos+1 === this._length}
                               errors={this.props.errors}>
            {this.props.inline && this.state.editPid === pos ? this.renderAddEditTemplate(v, false) :
                <RenderTemplate template={contentTemplate}
                                labelKey={this.props.labelKey}
                                pos={pos}
                                pid={key}
                                value={v}
                                showKey={this.props.showKey}
                                onClick={this.props.canEdit ? this.handleEdit : null}/> }
        </RenderTemplate>
    }

    render() {
        var {className, listContainerClass} = this.props;
        return (<div className={className}>
            {this.renderAdd()}
            <ul className={listContainerClass}>
                {this.renderRows()}
            </ul>
        </div>);
    }

}
