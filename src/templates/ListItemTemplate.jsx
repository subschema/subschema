import React, {Component} from 'react';
import {path, noop} from '../tutils';
import Buttons from './ButtonsTemplate';
import style from 'subschema-styles/ListItemTemplate-style';

export default class ListItemTemplate extends Component {
    static defaultProps = {
        type: 'Text',
        onMoveUp: noop,
        onMoveDown: noop,
        onDelete: noop,
        onValidate: noop,
        onValueChange: noop,
        onEdit: noop,
        last: false
    }

    handleMoveUp = (e)=> {
        e.preventDefault();
        this.props.onMoveUp(this.props.pos, this.props.value, this.props.pid);
    }

    handleMoveDown = (e)=> {
        e.preventDefault();
        this.props.onMoveDown(this.props.pos, this.props.value, this.props.pid);
    }

    handleDelete = (e)=> {
        e.preventDefault();
        this.props.onDelete(this.props.pos, this.props.value, this.props.pid);
    }

    handleEdit = (e)=> {
        e.preventDefault();
        var val = this.props.value;

        this.props.onEdit(this.props.pos, val.value, this.props.pid);
    }

    buttons(pos, last, canReorder, canDelete) {
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
        return buttons;
    }

    render() {
        var {pos,  value, errors, path, onValidate,type, name, canReorder, canDelete, last, onValueChange} = this.props;
        var error = errors && errors[0] && errors[0].message;
        return <li className={style.listGroupItem+' '+(error ? style.hasError : '')}>
            { error ? <p ref="error" key="error" className={style.help}>{error}</p> : null }
            <Buttons key="buttons" buttons={this.buttons(pos, last, canReorder, canDelete)} ref="buttons"
                     buttonsClass={style.buttonsClass}/>
            {this.props.children}
        </li>

    }

}