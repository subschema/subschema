import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {ListView, TouchableHighlight, StyleSheet, Text, View} from 'react-native';

export default class ListType extends Component {
    componentWillReceiveProps(props) {
        this._updateDS(props.value);
    }

    componentWillMount() {
        this._updateDS(this.props.value);
    }

    _updateDS(value) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(value || []),
        });
    }

    render() {
        return <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
        />;
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight onPress={() => this._pressRow(rowID)}>
                <View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {rowData}
                        </Text>
                        <Text>
                            {this.state.editPid === rowID ? 'Selected' : ''}
                        </Text>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    _pressRow(rowId) {
        this.setState({editPid: rowId});
    }
}

var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6',
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    thumb: {
        width: 64,
        height: 64,
    },
    text: {
        flex: 1,
    },
});