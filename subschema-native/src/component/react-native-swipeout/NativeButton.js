import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    TouchableHighlight,
    Text,
    StyleSheet,
    Platform,
    View,
    ViewPropTypes,
} from 'react-native';

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    textButton: {
        fontSize: 14,
        alignSelf: 'center',
    },
    opacity: {
        opacity: 0.8,
    },
});
function concat(...args) {
    const ret = [];
    for (const arg of args) {
        if (!arg) continue;
        if (Array.isArray(arg)) {
            ret.push(...concat(...arg));
        } else {
            ret.push(arg);
        }
    }
    return ret.length == 1 ? ret[0] : ret;
}
export default class NativeButton extends Component {

    static propTypes = {
        // Extract parent props
        ...TouchableWithoutFeedback.propTypes,
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        disabledStyle: Text.propTypes.style,
        children: PropTypes.node.isRequired,
        underlayColor: PropTypes.string,
        background: (TouchableNativeFeedback.propTypes) ? TouchableNativeFeedback.propTypes.background : PropTypes.any,
    };

    static isAndroid = (Platform.OS === 'android');
    static defaultProps = {
        disabledStyle: styles.opacity,
        style: styles.button,
        textStyle: styles.textButton,
        underlayColor: null,
    };

    _renderText() {
        // If children is not a string don't wrapp it in a Text component
        if (typeof this.props.children !== 'string') {
            return this.props.children;
        }

        return (
            <Text style={this.props.textStyle }>
                { this.props.children }
            </Text>
        );
    }

    render() {

        // Extract Button props
        const buttonProps = {
            accessibilityComponentType: this.props.accessibilityComponentType,
            accessibilityTraits: this.props.accessibilityTraits,
            accessible: this.props.accessible,
            delayLongPress: this.props.delayLongPress,
            delayPressIn: this.props.delayPressIn,
            delayPressOut: this.props.delayPressOut,
            disabled: this.props.disabled,
            hitSlop: this.props.hitSlop,
            onLayout: this.props.onLayout,
            onPress: this.props.onPress,
            onPressIn: this.props.onPressIn,
            onPressOut: this.props.onPressOut,
            onLongPress: this.props.onLongPress,
            pressRetentionOffset: this.props.pressRetentionOffset,
        };
        const style = this.props.disabled ? concat(this.props.style, this.props.disabledStyle) : this.props.style;

        // Render Native Android Button
        if (NativeButton.isAndroid) {
            Object.assign(buttonProps, {
                background: this.props.background || TouchableNativeFeedback.SelectableBackground(),
            });

            return (
                <TouchableNativeFeedback
                    {...buttonProps}>
                    <View style={style}>
                        {this._renderText()}
                    </View>
                </TouchableNativeFeedback>
            );
        }

        // Render default button
        return (
            <TouchableHighlight
                {...buttonProps}
                style={style}
                underlayColor={ this.props.underlayColor }>
                { this._renderText() }
            </TouchableHighlight>
        );
    }
}