import React, {Component} from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'subschema-prop-types';
const header = {
    borderBottomWidth: 1,
    borderColor: '#bbb',
    fontWeight: "600"
};
export default class JSONView extends Component {
    static propTypes = {
        label: PropTypes.string,
        value: PropTypes.value
    };

    render() {
        const {value = {}, label = ""} = this.props;
        return <View>
            <Text style={header}>{label}:</Text>
            <Text style={
                {
                    margin: 10,
                    padding: 10
                }
            }>{JSON.stringify(value, null, 2)}</Text>
        </View>
    };
}
