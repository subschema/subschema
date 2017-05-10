import React, {Component} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import Buttons from './ButtonsTemplate';
import PropTypes from 'subschema-prop-types';


var styles = StyleSheet.create();
class ModalTemplate extends Component {

    static contextTypes = {
        valueManager: PropTypes.valueManager,
        parentValueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    }

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = {};
        this.state.visibile = false;
    }

    componentDidMount() {
        this.setState({visible: !this.state.visible});
    }

    handleClose = (e) => {
        e && e.preventDefault();
        // setTimeout(()=>this.setState({visible:false}), 200);
        if (this.props.dismiss)
            this.context.parentValueManager.update(this.props.dismiss, false);
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

    renderFooter(buttons) {
        if (!buttons) return null;
        return <Buttons buttons={buttons} onButtonClick={this.handleBtnClose}/>
    }

    render() {
        const {title, legend, buttons, path, value, bodyClass, innerContainerTransparentClass, headerClass, closeClass, contentClass, backdropClass, dialogClass, namespaceClass, overlayClass, children, ...rest} = this.props;

        return (
            <Modal
                animated={true}
                transparent={this.state.transparent}
                visible={this.state.visible}>
                <View style={[overlayClass, backdropClass]}>
                    <View style={[bodyClass, innerContainerTransparentStyle]}>
                        <Text style={headerClass}>{title}</Text>
                        <View style={contentClass}>{children}</View>
                        {this.renderFooter(buttons)}
                    </View>
                </View>
            </Modal>
        );
    }
}
/*  <View animation="tada" delay={3000}>*/
export default class ModalTemplateWrapper extends Component {
    static  contextTypes = PropTypes.contextTypes;

    render() {
        var {...context} = this.context;
        var {...props} = this.props;
        return <ModalTemplate {...props}/>
    }
}
