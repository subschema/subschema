import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';

import {Picker, StyleSheet} from 'react-native';

const {Item} = Picker;

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
        return <Picker
            selectedValue={this.props.value}
            onValueChange={this.handleChange}>
            {this.props.options.map(SelectInput.toOption)}
        </Picker>
    }

}
