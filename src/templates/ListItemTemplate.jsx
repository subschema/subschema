var React = require('../react');
var tpath = require('../tutils').path;
//var PropsStateValueMixin = require('../PropsStateValueMixin');
var ListItemTemplate = React.createClass({
//    mixins: [require('../PropsStateValueMixin')],
    getDefaultProps() {
        return {
            type: 'Text',
            onMoveUp() {
            },
            onMoveDown() {
            },
            onDelete() {
            },
            onValidate() {
            },
            onValueChange() {
            },
            onEdit() {
            },
            last: false,
            itemToString: function (v) {
                return v != null ? v.toString() : '';
            }
        }
    },
    handleMoveUp(e) {
        e.preventDefault();
        this.props.onMoveUp(this.props.pos, this.props.value, this.props.pid);
    },
    handleMoveDown(e) {
        e.preventDefault();
        this.props.onMoveDown(this.props.pos, this.props.value, this.props.pid);
    },
    handleDelete(e) {
        e.preventDefault();
        this.props.onDelete(this.props.pos, this.props.value, this.props.pid);
    },
    handleEdit(e) {
        e.preventDefault();
        var val = this.props.value;
        if (this.props.valueProp) {
            val = {};
            val[this.props.valueProp] = this.props.value;
        }

        this.props.onEdit(this.props.pos, val, this.props.pid);
    },
    renderField(){
        var field = this.props.field, content = this.props.itemToString(this.props.value);

        if (field.canEdit) {
            return <span className="item-value" ref="edit" onClick={this.handleEdit}
                         path={tpath(this.props.path, this.props.pos)}>{content}</span>;
        } else {
            return <span className="item-value">{content}</span>;
        }
    },
    render() {
        var {pos, field, value, errors, path, onValidate, last, onValueChange} = this.props;
        var {type, name, canReorder, canDelete} = field;
        var error = errors && errors[0] && errors[0].message;
        var btnCls = 'btn btn-xs btn-default'
        return <li className={'list-group-item '+(error ? 'has-error' : '')}>
            {this.renderField()}

            { error ? <p ref="error" className="help-block">{error}</p> : null }
            <div className="btn-group  pull-right">
                {canReorder && pos > 0 ? <button onClick={this.handleMoveUp} ref="upBtn" className={btnCls}
                                                 title="Move Up">
                    <i className='glyphicon glyphicon-chevron-up'/>
                </button> : null }
                {canReorder && !last ? <button onClick={this.handleMoveDown} ref="downBtn" className={btnCls}
                                               title="Move Down">
                    <i className='glyphicon glyphicon-chevron-down'/>
                </button> : null }
                { canDelete ? <button onClick={this.handleDelete} className={btnCls} ref="deleteBtn" title="Delete">
                    <i
                        className='glyphicon glyphicon-remove'/>
                </button> : null}
            </div>
        </li>
    }

});
module.exports = ListItemTemplate;