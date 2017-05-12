import React, {Component} from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Text,
    StyleSheet,
    PanResponder
} from 'react-native';
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
        pullTabClass: styleClass,
        containerClass: styleClass,
        ctrlButtonsClass: styleClass,
        notAnimatedClass: styleClass,
        wrapperClass: styleClass,
        moveUpClass: styleClass,
        moveDownClass: styleClass,
        deleteClass: styleClass,
        rowData: PropTypes.any,
        sectionId: PropTypes.any
    };


    componentWillMount() {
        this.setState({slide: new Animated.Value(this.width - 10)})
    }

    handleMoveUp = () => {
        this.props.onMoveUp(this.props.pos, this.props.value, this.props.pid);
    };
    handleMoveDown = () => {
        this.props.onMoveDown(this.props.pos, this.props.value, this.props.pid);
    };
    handleDelete = () => {
        this.props.onDelete(this.props.pos, this.props.value, this.props.pid);
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
                    buttonClass: this.props.moveUpClass
                });
            }
            if (!last) {
                buttons.push({
                    onPress: this.handleMoveDown,
                    text: 'Down',
                    type: 'secondary',
                    action: 'down',
                    buttonClass: this.props.moveDownClass,
                });

            }

        }
        if (canDelete) {
            buttons.push({
                onClick: this.handleDelete,
                text: 'Delete',
                action: 'delete',
                type: 'delete',
                buttonClass: this.props.deleteClass,
                label: ''
            });
        }
        return buttons
    }


    render() {
        const left = this.props.canEdit ? [{text: 'Edit', onPress: this.handleEdit}] : null;
        return <Swipeout
            rowId={this.props.pos}
            sectionId={this.props.sectionId}
            autoClose={true}
            left={left}
            right={this.buttons(this.props.pos, this.props.last, this.props.canReorder, this.props.canDelete)}>{this.props.children}
        </Swipeout>
    }
}