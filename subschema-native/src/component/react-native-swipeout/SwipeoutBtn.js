import React, {Component,} from 'react';

import {
    PanResponder,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    ViewPropTypes,
} from 'react-native';

import NativeButton from './NativeButton';
import styles from './styles';
import PropTypes from 'prop-types';
function asArray(value) {
    return value == null ? [] : Array.isArray(value) ? value.slice(0) : [value];
}
export default class SwipeoutBtn extends Component {


    static propTypes = {
        backgroundColor: PropTypes.string,
        color: PropTypes.string,
        component: PropTypes.node,
        onPress: PropTypes.func,
        text: PropTypes.string,
        type: PropTypes.string,
        underlayColor: PropTypes.string,
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style
    };

    static defaultProps = {
        backgroundColor: null,
        color: null,
        component: null,
        underlayColor: null,
        height: 0,
        onPress: null,
        disabled: false,
        text: 'Click me',
        type: '',
        width: 0,
  //      style: [styles.swipeoutBtnTouchable, styles.swipeoutBtn],
 //       textStyle: [styles.swipeoutBtnText]
    };


    render() {
        const btn = this.props;

        const styleSwipeoutBtn = asArray(this.props.style);
        styleSwipeoutBtn.push({
            height: btn.height,
            width: btn.width,
        });

        //  apply background color
        if (btn.backgroundColor) styleSwipeoutBtn.push([{backgroundColor: btn.backgroundColor}]);

        const styleSwipeoutBtnComponent = [{
            height: btn.height,
            width: btn.width,
        }];

        const styleSwipeoutBtnText = asArray(btn.textStyle);

        //  apply text color
        if (btn.color) styleSwipeoutBtnText.push([{color: btn.color}]);
        return (<NativeButton
            onPress={this.props.onPress}
            underlayColor={this.props.underlayColor}
            disabled={this.props.disabled}
            style={ styleSwipeoutBtn}
            textStyle={styleSwipeoutBtnText}>
            {
                (btn.component ?
                        <View style={styleSwipeoutBtnComponent}>{btn.component}</View>
                        :
                        btn.text
                )
            }
        </NativeButton>);
    }
}

