var React = require('../react');
var Editor = require('../Editor');
var Constants = require('../Constants');
var ValueManager = require('../ValueManager');
var BasicFieldMixin = require('../BasicFieldMixin');
var LoaderMixin = require('../LoaderMixin');

var CollectionMixin = {
    statics: {
        listClassName: Constants.listClassName,
        itemTemplate: 'ListItemTemplate'
    },
    mixins: [BasicFieldMixin, LoaderMixin],
    getInitialState() {
        return {};
    },
    getDefaultProps(){
        return {
            createTemplate: 'CollectionCreateTemplate',
            buttonTemplate: 'ButtonTemplate'
        }
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
        if (this.props.handleChange(this.unwrap(newValue)) !== false) {

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
        this.setState({showAdd: true, editValue: {}});
    },
    handleCancelAdd(e) {
        e && e.preventDefault();
        this.setState({showAdd: false, showEdit: false, editValue: null});
    },
    handleAddValue(e, value) {
        e && e.preventDefault();
        this.addValue(value);
    },
    handleEditValue(e, nv) {
        e && e.preventDefault();
        var value = this.state.wrapped, oval = value && value.concat(), editPid = this.state.editPid;
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
        var CreateTemplate = this.template('createTemplate');
        var title = this.props.title || '';
        return (
            <CreateTemplate editPid={this.state.editPid} field={this.getTemplateItem()}
                            valueManager={this.props.valueManager}
                            name={this.props.name}
                            ref="addEdit"
                            value={this.state.editValue}
                            title={create ? 'Create ' + title : 'Edit ' + title  }
                            submitButton={label}
                            onCancel={this.handleCancelAdd}
                            onSubmit={handler}/>)
    },
    /* return <div className="clearfix">
     <button className="btn btn-xs pull-right btn-default" ref="addBtn" onClick={this.handleAddBtn}><i
     className="icon-add"/>Add
     </button>
     </div>*/
    renderAddBtn() {
        if (!this.props.field.canAdd) {
            return null;
        }
        var Template = this.template('buttonTemplate');
        return <Template ref="addBtn" buttonClass='btn btn-xs btn-default btn-add' label="Add"
                         iconClassName="icon-add" onClick={this.handleAddBtn}><i
            className="icon-add"/>
        </Template>

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