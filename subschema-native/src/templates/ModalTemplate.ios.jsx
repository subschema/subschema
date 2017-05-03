import React, {Component} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import Buttons from './ButtonsTemplate';
import PropTypes from 'subschema-prop-types';


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    innerContainer: {
        borderRadius: 10,
        flexDirection: 'column',
        //  alignItems: 'center',
        flex: 1,
        borderColor: '#9da3a6',
        borderWidth: 1,
    },
    body: {
        alignItems: 'flex-start',
        flexDirection: 'row',

        flex: 1
    },
    row: {
        alignItems: 'center',
        //  flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
//        flex: 1,
        flexDirection: 'row',
        fontWeight: 'bold',
    },
    buttons: {
        /*  flexDirection: 'row',
         justifyContent: 'space-between',
         flexWrap: 'nowrap',
         borderWidth: 1,
         borderColor: 'red',*/
    },
    button: {
        borderRadius: 5,
        flex: 1,
        height: 44,
        alignSelf: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center',
    },
    modalButton: {
        marginTop: 10,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
    },
    innerContainerTransparentStyle: {
        backgroundColor: '#fff',
        padding: 20
    }
});
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
        var {title, buttons, path, value, children, ...rest} = this.props;

        return (
            <Modal
                animated={true}
                transparent={this.state.transparent}
                visible={this.state.visible}>
                <View style={[styles.container, styles.modalBackgroundStyle]}>
                    <View style={[styles.innerContainer, styles.innerContainerTransparentStyle]}>
                        <Text style={styles.rowTitle}>{title}</Text>
                        <View style={styles.body}>{children}</View>
                        <View style={styles.buttons}>
                            {this.renderFooter(buttons)}
                        </View>
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
