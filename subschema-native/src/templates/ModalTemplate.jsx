import React, {Component} from 'react';
import {Modal, StyleSheet, Text, ScrollView, View} from 'react-native';
import ButtonsTemplate from './ButtonsTemplate';
import {styleClass} from '../PropTypes';
import PropTypes from 'subschema-prop-types';
import {RenderTemplate} from 'subschema-native';

export default class ModalTemplate extends Component {


    static propTypes = {
        ...Modal.propTypes,
        title: PropTypes.string,
        containerClass: styleClass,
        overlayClass: styleClass,
        contentClass: styleClass,
        headerClass: styleClass,
        bodyClass: styleClass,
        backdropClass: styleClass,
        innerContainerTransparentStyle: styleClass,
        Buttons: PropTypes.template,
        CloseButton: PropTypes.template,
        onButtonClick: PropTypes.func
    };

    static defaultProps = {
        ...Modal.defaultProps,
        animationType: "slide",
        Buttons: 'ButtonsTemplate',
        CloseButton: false
    };
    state = {
        visible: false
    };

    componentDidMount() {
        this.setState({visible: !this.state.visible});
    }

    handleClose = (e) => {
        this.setState({visible: false});
    };
    handleCancel = () => {
        this.props.onButtonClick && this.props.onButtonClick();
        this.handleClose();
    };
    handleBtnClose = (e, action) => {
        switch (action) {
            case 'submit': {
                this.props.onSubmit(e);
                this.handleClose(e);
                break;
            }
            case 'close':
            case 'cancel':
                this.handleCancel(e);

                break;
        }

    };

    renderFooter(Buttons, buttons) {
        if (!buttons) return null;
        return <Buttons buttons={buttons} onButtonClick={this.handleBtnClose}/>
    }

    renderCloseButton() {
        const {CloseButton} = this.props;
        if (CloseButton) {
            const {Template, ...props} = CloseButton;
            return <RenderTemplate template={Template} {...props} onClick={this.handleCancel}/>
        }
        return null;
    }

    render() {
        const {Buttons, title, containerClass, animationType, legend, buttons, path, value, bodyClass, innerContainerTransparentClass, headerClass, closeClass, contentClass, backdropClass, dialogClass, namespaceClass, overlayClass, children, ...rest} = this.props;

        return (<Modal
            {...rest}
            animationType={animationType}
            transparent={this.state.transparent}
            onRequestClose={this.handleClose}
            style={containerClass}
            visible={this.state.visible}>
            <View style={[overlayClass, backdropClass]}>
                {this.renderCloseButton()}
                <ScrollView style={[bodyClass, innerContainerTransparentClass]}>
                    <Text style={headerClass}>{title}</Text>
                    <View style={contentClass}>{children}</View>
                    {this.renderFooter(Buttons, buttons)}
                </ScrollView>
            </View>
        </Modal>);
    }
}