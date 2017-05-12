import React from 'react';
import {View, Text} from 'react-native';
import Content from '../Content';
import {styleClass} from '../PropTypes'
import {CollectionCreateTemplate as DomCollectionCreateTemplate} from 'subschema-component-list';

export default class CollectionCreateTemplate extends DomCollectionCreateTemplate {
    static propTypes = {
        ...DomCollectionCreateTemplate.propTypes,
        groupClass: styleClass,
        panelClass: styleClass,
        panelBodyClass: styleClass,
        panelTitleClass: styleClass,
        panelHeadingClass: styleClass
    };

    renderInline() {
        return <View style={this.props.inlineClass}>{this.props.children}</View>
    }

    renderPanel() {
        let {title, panelClass, editText, createText, panelTitleClass, panelHeadingClass, panelBodyClass, groupClass, create} = this.props;
        if (title === false) {
            title = '';
        } else if (title == null) {
            title = create ? createText : editText;
        } else if (typeof title === 'string') {
            title = {
                type: 'Text',
                content: (create ? `${createText} ${title}` : `${editText} ${title}`),
                className: panelTitleClass
            }
        }
        return (<View style={panelClass}>
            <Content content={title} style={panelHeadingClass}/>
            <View style={this.props.panelBodyClass}>
                <View style={this.props.groupClass}>
                    {this.props.children}
                </View>
            </View>
        </View>);
    }
}