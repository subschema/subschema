import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {ListItemTemplate as DomListItemTemplate} from 'subschema-component-list';
import Buttons from './ButtonsTemplate';

export default class ListItemTemplate extends DomListItemTemplate {
    static propTypes = DomListItemTemplate.propTypes;

    static defaultProps = {
        ...DomListItemTemplate.defaultProps,
        Buttons,
        type: 'Text'
    };
    buttons(...args){
        const btns = super.buttons(...args);
        btns.forEach(function(btn){
            btn.label = btn.title || btn.action;
        })
        return btns;
    }
    render() {
        let {pos, Buttons, value, errors, path, ctrlButtonsClass, buttonsClass, listGroupItemClass, helpClass, onValidate, type, name, hasErrorClass, canReorder, canDelete, last, onValueChange} = this.props;
        let error = errors && errors[0] && errors[0].message;
        const style = [listGroupItemClass];
        if (error) {
            style.push(hasErrorClass)
        }
        return <View style={style}>
            { error ? <Text ref="error" key="error" style={helpClass}>{error}</Text> : null }
            <Buttons key="buttons" buttons={this.buttons(pos, last, canReorder, canDelete)}
                     buttonsClass={ctrlButtonsClass} buttonContainerClass={buttonsClass}/>
            {this.props.children}
        </View>

    }

}