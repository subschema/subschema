import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';

import {PickerIOS, StyleSheet} from 'react-native';

const {Item} = PickerIOS;

export default class SelectInput extends Component {

    static defaultProps = {
        options: []
    };

    static propTypes = {
        options: PropTypes.options,
        onChange: PropTypes.valueEvent
    };

    static toOption(opt, i) {
        return <Item
            key={opt.val}
            value={opt.val}
            label={opt.label}
        />
    }

    handleChange = (v) => {
        this.props.onChange(v);
    };

    render() {
        return <PickerIOS
            selectedValue={this.props.value}
            onValueChange={this.handleChange}>
            {this.props.options.map(SelectInput.toOption)}
        </PickerIOS>
    }

}
