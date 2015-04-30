var React = require('../react');
var tpath = require('../tutils').path;
var Buttons = require('../templates/ButtonsTemplate.jsx');
var ListItemTemplate = React.createClass({
    mixins: [require('./ListItemMixin')],
    renderField(){
        var field = this.props.field, content = this.props.itemToString(this.props.value);

        if (field.canEdit) {
            return <a className="item-value" ref="edit" onClick={this.handleEdit}
                      path={tpath(this.props.path, this.props.pos)}>{content}</a>;
        } else {
            return <span className="item-value">{content}</span>;
        }
    },
    buttons(pos, last, canReorder, canDelete){
        var buttons = [];
        var buttonClass = 'btn btn-xs btn-default'
        if (canReorder) {
            if (pos > 0) {
                buttons.push({
                    onClick: this.handleMoveUp,
                    title: 'Move Up',
                    label: '',
                    iconClass: 'glyphicon glyphicon-chevron-up',
                    buttonClass,
                    ref: 'upBtn'
                });
            }
            if (!last) {
                buttons.push({
                    onClick: this.handleMoveDown,
                    title: 'Move Down',
                    iconClass: 'glyphicon glyphicon-chevron-down',
                    buttonClass,
                    label: '',
                    ref: 'downBtn'
                });

            }
            if (canDelete) {
                buttons.push({
                    onClick: this.handleDelete,
                    title: 'Delete',
                    iconClass: 'glyphicon glyphicon-remove',
                    buttonClass,
                    label: '',
                    ref: 'deleteBtn'
                });
            }
        }

        return buttons;
    },
    render() {
        var {pos, field, value, errors, path, onValidate, last, onValueChange} = this.props;
        var {type, name, canReorder, canDelete} = field;
        var error = errors && errors[0] && errors[0].message;
        return <li className={'list-group-item '+(error ? 'has-error' : '')}>
            {this.renderField()}
            { error ? <p ref="error" className="help-block">{error}</p> : null }
            <Buttons buttons={this.buttons(pos, last, canReorder, canDelete)} ref="buttons"
                     buttonsClass='btn-group pull-right'/>
        </li>
    }

});
module.exports = ListItemTemplate;