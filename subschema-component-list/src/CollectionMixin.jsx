import React, { PureComponent } from 'react';
import { clone, noop, resolveKey } from 'subschema-utils';
import UninjectedObjectType from 'subschema-core/lib/Object';
import PropTypes from 'subschema-prop-types';
import defaults from 'lodash/defaults';
import renderTemplate from 'subschema-core/lib/RenderTemplate';

export const settings = {
    //configure the path that nested editing happens at.
    editPath: `@edit@{path}`
};

const isEmpty = (v) => {
    if (v == null || v === false || v === true || v === '') {
        return true;
    }

    if ('length' in v) {
        return v.length == 0;
    }


    return false;
};
export default class CollectionMixin extends PureComponent {

    static inputClassName = 'list-editor';
    static contextTypes   = {
        valueManager: PropTypes.valueManager,
        injector    : PropTypes.injector
    };
    static propTypes      = {
        onChange          : PropTypes.valueEvent,
        path              : PropTypes.path,
        canEdit           : PropTypes.bool,
        canDelete         : PropTypes.bool,
        canAdd            : PropTypes.bool,
        inline            : PropTypes.bool,
        labelKey          : PropTypes.string,
        itemType          : PropTypes.typeDescription,
        editType          : PropTypes.typeDescription,
        createType        : PropTypes.typeDescription,
        editPath          : PropTypes.value,
        onEdit            : PropTypes.valueEvent,
        editTemplate      : PropTypes.template,
        createTemplate    : PropTypes.template,
        buttonTemplate    : PropTypes.template,
        itemTemplate      : PropTypes.template,
        contentTemplate   : PropTypes.template,
        buttons           : PropTypes.buttons,
        addButton         : PropTypes.button,
        listContainerClass: PropTypes.cssClass,
        ObjectType        : PropTypes.injectClass,
        value             : PropTypes.value,
        title             : PropTypes.string,
        errors            : PropTypes.errors
    };

    static defaultProps = {
        onWillReorder  : noop,
        onWillChange   : noop,
        onWillAdd      : noop,
        onWillDelete   : noop,
        createTemplate : 'CollectionCreateTemplate',
        editTemplate   : 'CollectionCreateTemplate',
        buttonTemplate : 'ButtonTemplate',
        itemTemplate   : 'ListItemTemplate',
        contentTemplate: "ContentItemTemplate",
        editPath       : settings.editPath,
        onEdit         : settings.editPath,
        itemType       : {
            type: 'Text'
        },
        addButton      : {
            "label"    : "Add",
            "className": "btn btn-default btn-add"
        },
        buttons        : {
            buttonsClass: 'btn-group pull-right',
            buttons     : [{
                label      : 'Cancel',
                action     : 'cancel',
                buttonClass: 'btn btn-default'
            }, {
                label      : 'Save',
                type       : 'submit',
                action     : 'submit',
                primary    : true,
                buttonClass: 'btn-primary btn'
            }]
        },
        ObjectType     : UninjectedObjectType
    };

    getValue() {
        return this.props.value;
    }


    handleDelete = (pos, val, pid) => {
        const values = clone(this.props.value);
        if (this.props.onWillDelete(pos, val) !== false) {
            if (Array.isArray(values)) {
                values.splice(pos, 1);
            } else {
                delete values[pid];
            }
            this.props.onChange(values);
        }
    };

    handleAddBtn = (e) => {
        e && e.preventDefault();
        const key      = this.createPid();
        const editPath = {
            mode   : 'add',
            origKey: key,
            schema : this.createItemSchema(false),
            path   : resolveKey(this.props.path, settings.editPath),
            pos    : this.count(),
            key,

        };
        this.props.onEdit(editPath);

    };

    handleEdit = (pos, value, key) => {
        const editPath = {
            value  : clone(value),
            mode   : 'edit',
            origKey: key,
            schema : this.createItemSchema(true),
            path   : resolveKey(this.props.path, settings.editPath),
            pos,
            key,
        };
        this.props.onEdit(editPath);
    };

    handleBtnClick = (e, action) => {
        e && e.preventDefault();
        switch (action) {
            case 'close':
            case 'cancel':
                this.props.onEdit();
                return;
            default: {
                this.handleSubmit();
            }
        }
    };

    handleSubmit() {
        const editPath = this.props.editPath;//this.context.valueManager.path(resolveKey(this.props.path,
                                             // settings.editPath));
        if (!editPath) {
            return;
        }
        const {
                  value,
                  key,
                  origKey,
                  mode
              }           = editPath;
        //value fix.
        const clonedValue = isEmpty(this.props.value) ? this.createDefValue()
            : clone(this.props.value);
        if (mode == 'edit' && origKey != key) {
            if (clonedValue) {
                if (Array.isArray(clonedValue)) {
                    clonedValue.splice(key, 1);
                } else {
                    delete clonedValue[origKey];
                }
            }
        }
        clonedValue[key] = value;
        this.props.onChange(clonedValue);
        this.props.onEdit();
    };


    renderAddEditTemplate() {
        if (!this.props.editPath) {
            return null;
        }

        const {
                  editTemplate, createTemplate,
                  editPath: { mode, path, schema },
                  ObjectType,
                  inline,
                  title,
              }      = this.props;
        const isEdit = mode === 'edit';

        const children = <ObjectType
            key={`editForm-${path}`}
            onButtonClick={this.handleBtnClick}
            schema={schema}
            path={path}
        />;
        return renderTemplate({
            key          : `addEditTemplate-${path}`,
            template     : isEdit ? editTemplate : createTemplate,
            create       : isEdit ? false : true,
            onButtonClick: this.handleBtnClick,
            inline,
            title,
            children,
        });
    }

    renderAddBtn() {
        if (!this.props.canAdd) {
            return null;
        }

        const btn = defaults({}, this.props.addButton,
            CollectionMixin.defaultProps.addButton);

        return renderTemplate({
            template : this.props.buttonTemplate,
            key      : "addBtn",
            onClick  : this.handleAddBtn,
            iconClass: this.props.iconAddClass,
            ...btn,
        });

    }

    renderAdd() {
        if (!this.props.editPath) {
            return this.renderAddBtn();
        }
        const { mode } = this.props.editPath;
        if (mode) {
            if (this.props.inline) {
                if (mode === 'edit') {
                    return null;
                }
            }
            return this.renderAddEditTemplate()
        }
        return this.renderAddBtn()
    }

    createItemSchema(edit) {
        const schema = {
            schema   : this.getTemplateItem(edit),
            fieldsets: [{
                fields : ['key', 'value'],
                buttons: this.props.buttons
            }]

        };
        return schema;
    }

    renderRowEach(data, rowId) {
        return this.renderRow(data, null, rowId, rowId);
    }

    renderRow(value, sectionId, pos, pid) {
        pid     = pid || pos;
        value   = { value };
        const {
                  itemTemplate,
                  contentTemplate,
                  editPath,
                  showKey,
                  labelKey,
              } = this.props;

        const last       = (this.count() === pos + 1);
        const path       = resolveKey(this.props.path, pid);
        const isEditItem = this.props.inline && pid == editPath.key;
        const key        = `${path}.${pid}`;

        const children = isEditItem ? this.renderAddEditTemplate(value, false)
            : renderTemplate({
                template: contentTemplate,
                key     : `render-inline-${key}`,
                onClick : this.props.canEdit ? this.handleEdit : null,
                labelKey,
                showKey,
                pos,
                pid,
                value,
                last,

            });

        return renderTemplate({
            template  : itemTemplate,
            onMoveUp  : this.handleMoveUp,
            onMoveDown: this.handleMoveDown,
            onDelete  : this.handleDelete,
            onEdit    : this.handleEdit,
            canReorder: this.props.canReorder,
            canDelete : this.props.canDelete,
            canEdit   : this.props.canEdit,
            canAdd    : this.props.canAdd,
            errors    : this.props.errors,
            path,
            labelKey,
            showKey,
            key,
            pos,
            pid,
            value,
            last,
            children,
        })
    }

    render() {
        const { className, listContainerClass } = this.props;
        return (<div className={className}>
            {this.renderAdd()}
            <ul key='container' className={listContainerClass}>
                {this.renderRows()}
            </ul>
        </div>);
    }

}
