var React = require('../react');
var Editor = require('../Editor');
var Constants = require('../Constants');
var ValueManager = require('../ValueManager');
var BasicFieldMixin = require('../BasicFieldMixin');
var LoaderMixin = require('../LoaderMixin');
var ReactCSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;
require('../styles/transitions.less');
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
    /* unwrap:function(value){
     if (value == null) return [];
     return value.map(this.extractValue);
     },*/
    handleBtnGroup(e, action, btn){
        e && e.preventDefault();
        switch (action) {

            case 'edit':
                this.handleEditValue(e, btn.props.valueManager.getValue());
                break;
            case 'save':
                this.handleAddValue(e, btn.props.valueManager.getValue());
                break;
            case 'cancel':
            default:
                this.handleCancelAdd(e);
        }
        this.setState({editPid: null});
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
        var value = this.state.wrapped,  editPid = this.state.editPid;

        var newValue = value.map(function (v, i) {
            if (v.id === editPid) {
                return {
                    id:editPid,
                    value:nv
                };
            }
            return v;
        });
        this.changeValue(newValue, value);

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
            <CreateTemplate key="addEdit" editPid={this.state.editPid} field={this.getTemplateItem()}
                            valueManager={this.props.valueManager}
                            name={this.props.name}
                            ref="addEdit"
                            value={this.state.editValue}
                            title={this.props.inline ? false : create ? 'Create ' + title : 'Edit ' + title  }
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
        return <Template ref="addBtn" key="addBtn" buttonClass='btn btn-xs btn-default btn-add' label="Add"
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
        return <ReactCSSTransitionGroup transitionName="transition_height" transitionAppear={true} transitionLeave={true}>{showAdd || showEdit ?
             showAdd || showEdit && !this.props.inline ? this.renderAddEditTemplate(showEdit, showAdd) : null
            : this.renderAddBtn()}</ReactCSSTransitionGroup>;
    }
}
module.exports = CollectionMixin;