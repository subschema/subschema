import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity, Animated, Text, StyleSheet, PanResponder} from 'react-native';
import {ListItemTemplate as DomListItemTemplate} from 'subschema-component-list';
import Buttons from './ButtonsTemplate';
import {styleClass} from '../PropTypes';
import Swipeout from 'react-native-swipeout';
import PropTypes from 'subschema-prop-types';

const {height, width} = Dimensions.get('window');
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
        rowData: PropTypes.any
    };

    width = width;

    componentWillMount() {
        this.setState({slide: new Animated.Value(this.width - 10)})
    }

    buttons(...args) {
        const btns = super.buttons(...args);
        btns.forEach(function (btn) {
            btn.label = btn.title;
        });
        console.log('btns', ...btns);
        return btns;
    }

    _toggle = (e) => {
        this.show = !this.show;

        e && e.stopPropagation();
        Animated.timing(                            // Animate over time
            this.state.slide,                      // The animated value to drive
            {
                duration: 500,
                toValue: this.show ? 0 : this.width - 10,                             // Animate to opacity: 1, or fully opaque
            }
        ).start();
    };

    renderSlider() {

        return <Animated.View style={ [this.props.notAnimatedClass, {width: this.width}, {left: this.state.slide}]}>
            <Buttons key="buttons"
                     buttons={this.buttons(this.props.pos, this.props.last, this.props.canReorder, this.props.canDelete)}
                     buttonClass={this.props.buttonClass}
                     buttonsClass={this.props.ctrlButtonsClass} buttonContainerClass={this.props.buttonsClass}/>
        </Animated.View>
    }

    _onLayout = (event) => {
        this.width = event.nativeEvent.layout.width;
        this.setState({slide: new Animated.Value(this.width - 10)});
        console.log('width', this.width);
    };

    renderOld() {
        return <TouchableOpacity onLayout={this._onLayout} style={this.props.wrapperClass} onPress={this._toggle}>
            {this.props.children}
            {this.renderSlider()}
        </TouchableOpacity>
    }

    render() {
        return <Swipeout
                         onOpen={(sectionID, rowID) => console.log('---open: sectionID:' + sectionID + 'rowid:' + rowID) }
                         onClose={() => console.log('===close') }
                         scroll={event => console.log('scroll event') }
        >
            {this.props.children}
        </Swipeout>
    }
}