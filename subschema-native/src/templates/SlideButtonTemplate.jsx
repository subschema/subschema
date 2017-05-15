import React, {Component} from 'react';
import {ListItemTemplate as DomListItemTemplate} from 'subschema-component-list';
import Buttons from './ButtonsTemplate';
import {styleClass} from '../PropTypes';
import Swipeout from '../component/react-native-swipeout/index.js';
import PropTypes from 'subschema-prop-types';

export default class SlideButtonTemplate extends DomListItemTemplate {

    state = {};
    show = false;
    static defaultProps = {
        ...DomListItemTemplate.defaultProps,
        Buttons,

        type: 'Text'
    };
    static propTypes = {
        ...DomListItemTemplate.propTypes,
        containerClass: styleClass,
        buttonContainer: styleClass,
        buttonTextClass: styleClass,
        editClass: styleClass,
        moveUpClass: styleClass,
        moveDownClass: styleClass,
        deleteClass: styleClass,
        editTextClass: styleClass,
        moveUpTextClass: styleClass,
        moveDownTextClass: styleClass,
        deleteTextClass: styleClass,
        rowData: PropTypes.any,
        sectionId: PropTypes.any
    };


    handleMoveUp = () => {
        this.props.onMoveUp(this.props.pos, this.props.value, this.props.pid);
    };
    handleMoveDown = () => {
        this.props.onMoveDown(this.props.pos, this.props.value, this.props.pid);
    };
    handleDelete = () => {
        this.props.onDelete(this.props.pos, this.props.value, this.props.pid);
    };
    handleEdit = () => {
        this.props.onEdit(this.props.pos, this.props.value, this.props.pid);
    };

    buttons(pos, last, canReorder, canDelete) {
        const buttons = [];
        if (canReorder) {
            if (pos > 0) {
                buttons.push({
                    onPress: this.handleMoveUp,
                    text: 'Up',
                    type: 'secondary',
                    action: 'up',
                    style: this.props.moveUpClass,
                    textStyle: this.props.moveUpTextClass
                });
            }
            if (!last) {
                buttons.push({
                    onPress: this.handleMoveDown,
                    text: 'Down',
                    type: 'secondary',
                    style: this.props.moveDownClass,
                    textStyle: this.props.moveDownTextClass
                });

            }

        }
        if (canDelete) {
            buttons.push({
                onPress: this.handleDelete,
                text: 'Delete',
                type: 'delete',
                style: this.props.deleteClass,
                textStyle: this.props.deleteTextClass
            });
        }
        return buttons
    }

    _handlePress = (e) => {
        e && e.stopPropagation();
        console.log('pressed');
    };

    render() {
        const left = this.props.canEdit ? [{
            text: 'Edit',
            style: this.props.editClass,
            textStyle: this.props.editTextClass,
            onPress: this.handleEdit
        }] : null;
        return <Swipeout
            rowId={this.props.pos}
            sectionId={this.props.sectionId}
            autoClose={true}
            onPress={this._handlePress}
            style={this.props.containerClass}
            left={left}
            right={this.buttons(this.props.pos, this.props.last, this.props.canReorder, this.props.canDelete)}>{this.props.children}
        </Swipeout>
    }
}