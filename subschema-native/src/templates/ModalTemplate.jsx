import React, {Component} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import ButtonsTemplate from './ButtonsTemplate';
import {styleClass} from '../PropTypes';
import PropTypes from 'subschema-prop-types';

export default class ModalTemplate extends Component {


    static propTypes = {
        title: PropTypes.string,
        overlayClass: styleClass,
        contentClass: styleClass,
        headerClass: styleClass,
        bodyClass: styleClass,
        backdropClass: styleClass,
        innerContainerTransparentStyle: styleClass,
        Buttons:PropTypes.injectClass
    };

    static defaultProps = {
        animationType: "slide",
        Buttons:ButtonsTemplate
    };
    state = {
        visible: false
    };

    componentDidMount() {
        this.setState({visible: !this.state.visible});
    }

    handleClose = (e) => {
        e && e.preventDefault();
        // setTimeout(()=>this.setState({visible:false}), 200);

    };

    handleBtnClose = (e, action) => {
        switch (action) {
            case 'submit': {
                this.props.onSubmit(e);
            }
            case 'close':
            case 'cancel':
                this.handleClose(e);
                break;
        }

    };

    renderFooter(Buttons, buttons) {
        if (!buttons) return null;
        return <Buttons buttons={buttons} onButtonClick={this.handleBtnClose}/>
    }

    render() {
        const {Buttons, title, animationType, legend, buttons, path, value, bodyClass, innerContainerTransparentClass, headerClass, closeClass, contentClass, backdropClass, dialogClass, namespaceClass, overlayClass, children, ...rest} = this.props;

        return (
            <Modal
                animationType={animationType}
                transparent={this.state.transparent}
                visible={this.state.visible}>
                <View style={[overlayClass, backdropClass]}>
                    <View style={[bodyClass, innerContainerTransparentClass]}>
                        <Text style={headerClass}>{title}</Text>
                        <View style={contentClass}>{children}</View>
                        {this.renderFooter(Buttons, buttons)}
                    </View>
                </View>
            </Modal>
        );
    }
}