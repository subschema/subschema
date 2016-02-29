import React, {Component, PropTypes} from 'react';
import {path, noop} from '../tutils';
import Buttons from './ButtonsTemplate';

export default class ListItemTemplate extends Component {
    static defaultProps = {
        type: 'Text',
        onMoveUp: noop,
        onMoveDown: noop,
        onDelete: noop,
        onValidate: noop,
        onValueChange: noop,
        onEdit: noop,
        canAdd: false,
        canReorder: false,
        canEdit: false,
        canDelete: false,
        last: false,
        errors: null,
        pos:0
    };

    handleMoveUp = (e)=> {
        e.preventDefault();
        this.props.onMoveUp(this.props.pos, this.props.value, this.props.pid);
    };

    handleMoveDown = (e)=> {
        e.preventDefault();
        this.props.onMoveDown(this.props.pos, this.props.value, this.props.pid);
    };

    handleDelete = (e)=> {
        e.preventDefault();
        this.props.onDelete(this.props.pos, this.props.value, this.props.pid);
    };

    handleEdit = (e)=> {
        e.preventDefault();
        var val = this.props.value;

        this.props.onEdit(this.props.pos, val.value, this.props.pid);
    };

    buttons(pos, last, canReorder, canDelete) {
        var buttons = [];
        var buttonClass = this.props.buttonClass;
        if (canReorder) {
            if (pos > 0) {
                buttons.push({
                    onClick: this.handleMoveUp,
                    title: 'Move Up',
                    label: '',
                    iconClass: this.props.moveUpClass,
                    buttonClass,
                    ref: 'upBtn'
                });
            }
            if (!last) {
                buttons.push({
                    onClick: this.handleMoveDown,
                    title: 'Move Down',
                    iconClass: this.props.moveDownClass,
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
                iconClass: this.props.deleteClass,
                buttonClass,
                label: '',
                ref: 'deleteBtn'
            });
        }
        return buttons;
    }

    render() {
        var {pos,  value, errors, path, buttonsClass, listGroupItemClass,helpClass, onValidate,type, name, hasErrorClass, canReorder, canDelete, last, onValueChange} = this.props;
        var error = errors && errors[0] && errors[0].message;
        return <li className={`${listGroupItemClass} ${(error ? hasErrorClass : '')}`}>
            { error ? <p ref="error" key="error" className={helpClass}>{error}</p> : null }
            <Buttons key="buttons" buttons={this.buttons(pos, last, canReorder, canDelete)} ref="buttons"
                     buttonsClass={buttonsClass}/>
            {this.props.children}
        </li>

    }

}