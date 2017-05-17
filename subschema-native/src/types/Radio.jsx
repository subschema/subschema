import React, {Component} from 'react';
import DomRadio from 'subschema-component-form/lib/types/Radio';
import {View, Switch} from 'react-native';
import {styleClass,} from '../PropTypes';

export default class Radio extends DomRadio {
    static propTypes = {
        ...DomRadio.propTypes,
        className: styleClass
    };
    static defaultProps = {
        ...DomRadio.defaultProps,
        labelType: 'DisplayText'
    };

    renderInput(onChange, ret, val) {
        const {value} = this.props;
        return <Switch
            onValueChange={() => {
                onChange.call(this, {target: {value:val}})
            }}
            value={val === value}/>
    }

    render() {
        return <View style={this.props.className}>{this.renderOptions(this.props.options)}</View>

    }

}