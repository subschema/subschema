"use strict";

import React, {Component} from 'react';
import Editor from '../components/Editor';
import Constants from '../Constants';
import ValueManager from '../ValueManager';
import NewChildContext from '../components/NewChildContext.jsx';
import tu, {isString, path, returnFirst, EMPTY_ARR} from '../tutils';
import ObjectType from './Object.jsx';
import PropTypes from '../PropTypes';
import map from 'lodash/collection/map';
import style from 'subschema-styles/CollectionMixin-style';
import listen from '../decorators/listen';
import template from '../decorators/template';

class EditChildContext extends Component {

    static propTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        path: PropTypes.string.isRequired
    };

    static childContextTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        parentValueManager: PropTypes.valueManager
    };

    getChildContext() {
        var parentValueManager = this.props.valueManager;
        var {loader,path} = this.props;
        var {...value} = this.props.value || parentValueManager.path(path);
        var valueManager = this.valueManager = ValueManager(value, parentValueManager.getErrors());
        return {valueManager, parentValueManager, loader};
    }

    handleSubmit = (e)=> {
        //t(e, vm.getErrors(), vm.getValue(), this.props.path)
        var value = this.valueManager.getValue(), errors = this.valueManager.getErrors();
        var currentPath = path(this.props.path, value.key);
        if (this.props.onSubmit(e, errors, value, currentPath) !== false) {
            this.props.valueManager.update(currentPath, value.value);
            if (this.props.childPath && value.key !== this.props.childPath) {
                this.props.valueManager.update(path(this.props.path, this.props.childPath), void(0));
            }
        }

        return false;
    }

    render() {
        return React.cloneElement(this.props.children, {onSubmit: this.handleSubmit});
    }
}

function wrapFunc(value, key) {
    return {value, key}
}

export default class CollectionMixin extends Component {


    static inputClassName = Constants.listClassName;

    static contextTypes = PropTypes.contextTypes;

    static propTypes = {
        onChange: PropTypes.valueEvent,
        path: PropTypes.path,
        canEdit: PropTypes.bool,
        canReorder: PropTypes.bool,
        canDelete: PropTypes.bool,
        canAdd: PropTypes.bool,
        inline: PropTypes.bool,
        labelKey: PropTypes.path,
        createTemplate: PropTypes.template,
        buttonTemplate: PropTypes.template,
        itemTemplate: PropTypes.template,
        itemType: PropTypes.schema
    };

    static defaultProps = {
        createTemplate: 'CollectionCreateTemplate',
        buttonTemplate: 'ButtonTemplate',
        itemTemplate: 'ListItemTemplate'
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        var state = this.state || (this.state = {});
        state.wrapped = map(props.value, wrapFunc);
    }

    componentWillReceiveProps(props) {
        if (props.value !== this.props.value) {
            this.setValue(props.value);
        }
    }

    getValue() {
        return this.unwrap(this.state.wrapped);
    }

    setValue(value) {
        this.setState({wrapped: map(value, wrapFunc)});
    }

    setErrors(errors) {
        this.setState({errors});
    }

    handleMoveUp = (pos, val) => {
        var values = this.state.wrapped, oval = values && values.concat();
        values.splice(Math.max(pos - 1, 0), 0, values.splice(pos, 1)[0]);
        this.changeValue(values, oval);
    }

    handleMoveDown = (pos, val)=> {
        var values = this.state.wrapped, oval = values && values.concat();
        values.splice(Math.min(pos + 1, values.length), 0, values.splice(pos, 1)[0]);
        this.changeValue(values, oval);

    }

    handleDelete = (pos, val, pid)=> {
        var values = this.state.wrapped, oval = values && values.concat();
        values.splice(pos, 1);
        this.changeValue(values, oval);
    }

    handleEdit = (pos, val, pid) => {
        this.setState({
            showAdd: false,
            showEdit: true,
            editPid: pid,
            editValue: {
                value: val,
                key: pid
            }
        });
    }

    changeValue = (newValue, oldValue)=> {
        if (this.props.onChange(this.unwrap(newValue)) !== false) {

            this.setState({
                wrapped: newValue,
                showAdd: false,
                showEdit: false,
                editValue: null
            });
        }
    }

    handleAddBtn = (e) => {
        e && e.preventDefault();
        this.setState({showAdd: true, editValue: this.newValue()});
    }

    handleCancelAdd = (e) => {
        e && e.preventDefault();
        this.setState({showAdd: false, showEdit: false, editValue: null});
    }

    handleBtnClick = (e, action)=> {
        e && e.preventDefault();
        if (action !== 'submit') {
            this.setState({
                showAdd: false,
                showEdit: false,
                editValue: null,
                editPid: null
            });
        }

    }

    handleSubmit = (e, errors, value)=> {
        e && e.preventDefault();
        if (errors == null || Object.keys(errors).length === 0) {
            this.setState({
                showAdd: false,
                showEdit: false,
                editValue: null,
                editPid: null
            });
        }
    }

    renderAddEditTemplate(edit, create) {
        var label = '';
        if (edit) {
            label = 'Save';
        } else if (create) {
            label = 'Create';
        } else {
            return null;
        }
        var title = this.props.title || '';
        return (
            <EditChildContext {...this.context} onSubmit={this.handleSubmit} path={this.props.path}
                                                childPath={this.state.editPid} value={this.state.editValue}>
                <ObjectType key="addEdit" objectTemplate={this.props.createTemplate}
                            onButtonClick={this.handleBtnClick}
                            schema={this.createItemSchema()}
                            title={this.props.inline && edit ? false : create ? 'Create ' + title : 'Edit ' + title  }

                />
            </EditChildContext>)
    }

    renderAddBtn() {
        if (!this.props.canAdd) {
            return null;
        }
        var Template = this.props.buttonTemplate;
        return <Template ref="addBtn" key="addBtn" buttonClass={style.addBtn} label="Add"
                         onClick={this.handleAddBtn}><i className={style.iconAdd}/>
        </Template>

    }

    renderAdd() {
        if (!(this.props.canAdd || this.props.canEdit)) {
            return null;
        }
        var {showAdd, showEdit} = this.state;
        return showAdd || showEdit ?
            showAdd || showEdit && !this.props.inline ? this.renderAddEditTemplate(showEdit, showAdd) : null
            : this.renderAddBtn();
    }

    createItemSchema() {
        return {
            schema: this.getTemplateItem(),
            fieldsets: [{
                fields: ['value', 'key'],
                buttons: {
                    buttonsClass: 'btn-group pull-right',
                    buttons: [{label: 'Cancel', action: 'cancel', buttonClass: 'btn btn-default'}
                        , {label: 'Save', type: 'submit', action: 'submit', buttonClass: 'btn-primary btn'}]
                }
            }]

        }
    }

    renderRowEach = (data, rowId)=> {
        return this.renderRow(data, null, rowId);
    }

    renderRow(v, sectionId, i) {
        var ItemTemplate = this.props.itemTemplate;

        return <ItemTemplate key={this.props.path+'.'+i} pos={i} path={ path(this.props.path, v.key)}
                             onMoveUp={this.handleMoveUp}
                             onMoveDown={this.handleMoveDown}
                             onDelete={this.handleDelete}
                             onEdit={this.handleEdit}
                             canReorder={this.props.canReorder}
                             canDelete={this.props.canDelete}
                             canEdit={this.props.canEdit}
                             field={v}
                             pid={v.key}
                             itemToString={this.itemToString()}
                             value={v} errors={this.props.errors} last={i + 1 === this.state.wrapped.length}>
            {this.props.inline && this.state.editPid === v.key ? this.renderAddEditTemplate(v, false) : null}
        </ItemTemplate>
    }

    render() {
        var {name,  itemType, errors,className, canReorder, canDelete, itemTemplate, canEdit, canAdd } = this.props, values = this.state.wrapped || EMPTY_ARR, length = values.length;
        return (<div className={className}>
            {this.renderAdd()}
            <ul>
                {values.map(this.renderRowEach)}
            </ul>
        </div>);
    }

}
