var React = require('react');
var Editor = require('../Editor.jsx');
var loader = require('../loader.jsx');
var Constants = require('../Constants');
var ValueManager = require('../ValueManager');
var CollectionMixin = {
    statics: {
        collectionCreateTemplate: 'CollectionCreateTemplate',
        listClassName: Constants.listClassName,
        itemTemplate: 'ListItemTemplate'
    },
    getInitialState() {
        return {};
    },
    componentWillMount(){
        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);
    },
    componentWillUnmount(){
        this.props.valueManager.removeListener(this.props.path, this.setValue, this);
    },
    getItemEditorValue(){
        return this.itemVM.getValue();
    },

    getValue(){
        return this.unwrap(this.state.wrapped);
    },
    setValue(value){
        this.setState(this.wrap({value}));
    },
    setErrors(errors){
        this.setState({errors});
    },
    handleMoveUp(pos, val) {
        var values = this.state.wrapped, oval = values && values.concat();
        values.splice(Math.max(pos - 1, 0), 0, values.splice(pos, 1)[0]);
        this.changeValue(values, oval);
    },
    handleMoveDown(pos, val) {
        var values = this.state.wrapped, oval = values && values.concat();
        values.splice(Math.min(pos + 1, values.length), 0, values.splice(pos, 1)[0]);
        this.changeValue(values, oval);

    },
    handleDelete(pos, val, pid) {
        var values = this.state.wrapped, oval = values && values.concat();
        values.splice(pos, 1);
        this.changeValue(values, oval);
    },
    handleEdit(pos, val, pid) {
        this.setState({
            showAdd: false,
            showEdit: true,
            editPid: pid,
            editValue: this.cloneVal(val)
        });
    },

    changeValue(newValue, oldValue) {
        if (this.props.valueManager.update(this.props.path, this.unwrap(newValue)) !== false) {

            this.setState({
                wrapped: newValue,
                showAdd: false,
                showEdit: false,
                editValue: null
            });
        }
    },
    handleAddBtn(e) {
        e && e.preventDefault();
        this.setState({showAdd: true, editValue: null});
    },
    handleCancelAdd(e) {
        e && e.preventDefault();
        this.setState({showAdd: false, showEdit: false, editValue: null});
    },
    handleAddValue(e) {
        e && e.preventDefault();
        this.addValue(this.getItemEditorValue());
    },
    handleEditValue(e) {
        e && e.preventDefault();
        var value = this.state.wrapped, oval = value && value.concat(), editPid = this.state.editPid, nv = this.getItemEditorValue();
        value.some(function (v, i) {
            if (v.id === editPid) {
                v.value = nv;
                return true;
            }
        });
        this.changeValue(value, oval);

    },

    addValue(newValue) {
        var values = this.state.wrapped || [], oval = values && values.concat();
        values.push({
            id: newValue.key || values.length,
            value: newValue
        });
        this.changeValue(values, oval);

    },

    renderAddEditTemplate(edit, create) {
        var handler, label = ''
        if (edit) {
            handler = this.handleEditValue;
            label = 'Save'
        } else if (create) {
            handler = this.handleAddValue;
            label = 'Create'
        } else {
            return null;
        }
        var value = this.state.editValue || (this.state.editValue = {})
        /*return <div className="panel-body">
         <div className="form-group">
         <Editor ref="itemEditor" field={this.getTemplateItem()} value={value}
         pid={this.state.editPid}
         form={null}/>
         </div>
         <div className="form-group">
         <button className="btn btn-default pull-left" ref="cancelBtn" onClick={this.handleCancelAdd}>Cancel
         </button>
         <button className="btn btn-primary pull-right" ref={create ? 'createBtn' : 'editBtn'}
         onClick={handler}>{label}</button>
         </div>
         </div>*/
        var CreateTemplate = loader.loadTemplate(this.props.collectionCreateTemplate);
        var title = this.props.title || '';
        this.itemVM = new ValueManager(this.state.editValue);
        return (<CreateTemplate editPid={this.state.editPid} field={this.getTemplateItem()}
                                ref="addEdit"
                                valueManager={this.itemVM}
                                title={create ? 'Create ' + title : 'Edit ' + title  }
                                submitButton={label}
                                onCancel={this.handleCancelAdd}
                                onSubmit={handler}/>)
    },
    renderAddBtn() {
        if (!this.props.field.canAdd) {
            return null;
        }
        return <div className="clearfix">
            <button className="btn btn-xs pull-right btn-default" ref="addBtn" onClick={this.handleAddBtn}><i
                className="icon-add"/>Add
            </button>
        </div>
    }
    ,

    renderAdd()
    {
        var field = this.props.field;
        if (!(field.canAdd || field.canEdit)) {
            return null;
        }
        var {showAdd, showEdit} = this.state;
        return showAdd || showEdit ?
            this.renderAddEditTemplate(showEdit, showAdd)
            : this.renderAddBtn();
    }
}
module.exports = CollectionMixin;