var React = require('../react');
var tpath = require('../tutils').path;
var Buttons = require('../templates/ButtonsTemplate.jsx');
var style = require('subschema-styles/ListItemTemplate-style');

var ListItemTemplate = React.createClass({
    mixins: [require('./ListItemMixin')],

    renderField(){
        var field = this.props.field, content = this.props.itemToString(this.props.value);

        return <span className={style.itemValue} path={tpath(this.props.path, this.props.value.key)}
                     onClick={field.canEdit ? this.handleEdit : null} key="content">{content}</span>;
    },
    buttons(pos, last, canReorder, canDelete){
        var buttons = [];
        var buttonClass = style.button;
        if (canReorder) {
            if (pos > 0) {
                buttons.push({
                    onClick: this.handleMoveUp,
                    title: 'Move Up',
                    label: '',
                    iconClass: style.moveUp,
                    buttonClass,
                    ref: 'upBtn'
                });
            }
            if (!last) {
                buttons.push({
                    onClick: this.handleMoveDown,
                    title: 'Move Down',
                    iconClass: style.moveDown,
                    buttonClass,
                    label: '',
                    ref: 'downBtn'
                });

            }
            if (canDelete) {
                buttons.push({
                    onClick: this.handleDelete,
                    title: 'Delete',
                    iconClass: style.delete,
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
        return <li className={style.listGroupItem+' '+(error ? style.hasError : '')}>
            {this.renderField()}
            { error ? <p ref="error" key="error" className={style.help}>{error}</p> : null }
            <Buttons key="buttons" buttons={this.buttons(pos, last, canReorder, canDelete)} ref="buttons"
                     buttonsClass={style.buttonsClass}/>
            {this.props.children}
        </li>

    }

});
module.exports = ListItemTemplate;