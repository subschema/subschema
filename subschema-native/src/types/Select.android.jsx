import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {Text, View, ListView, TouchableHighlight, StyleSheet} from 'react-native';

var DSRowHasChange = {rowHasChanged: (r1, r2) => r1 !== r2};

export default class SelectInput extends Component {
    static propTypes = {
        multiselect: PropTypes.bool,
        options: PropTypes.options,
        onChange: PropTypes.valueEvent
    };
    static defaultProps = {
        options: [],
        multiselect: false
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        var selected = props.value || [];
        var dataSource = new ListView.DataSource(DSRowHasChange).cloneWithRows(this.normalizeOptions(selected));
        this.state = {
            selected,
            dataSource
        }
    }

    componentWillReceiveProps(props) {
        if (this.props.value !== this.state.selected) {
            this.handleValue(props.value);
        }
    }

    handleValue(selected) {

        if (this.props.multiselect) {
            selected = Array.isArray(selected) ? selected.concat() : selected ? [selected] : [];
        } else {
            selected = selected ? [selected] : [];
        }
        this.setState({selected, dataSource: this.state.dataSource.cloneWithRows(this.normalizeOptions(selected))});

    }

    _renderRow(rowData, sectionID, rowID) {
        var row = [styles.row];
        rowData = rowData || {};
        if (rowData.selected) {
            row.push(styles.selected);
        }

        return (
            <TouchableHighlight onPress={()=>this._pressRow(rowData.val)}>
                <View>
                    <View style={row}>
                        <Text style={styles.text }>
                            {rowData.label || rowData.val}
                        </Text>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    _pressRow = (rowId)=> {
        var multiselect = this.state.multiselect, selected = this.state.selected, idx = selected.indexOf(rowId);
        if (idx > -1) {
            selected.splice(idx, 1);
        } else if (multiselect) {
            selected = selected.concat(rowId);
        } else {
            selected = [rowId];
        }
        this.props.onChange(multiselect ? selected : selected[0]);
    }

    normalizeOptions(selected) {
        selected = selected || [];
        return this.props.options.map((opt)=> {
            var {...rest} = opt;
            rest.selected = selected.indexOf(opt.val) > -1;
            return rest;
        });
    }

    render() {
        return <ListView
            initialListSize={this.state.multiselect ? this.state.selected.length : 1}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
        />
    }

}


var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6',
    },
    selected: {
        backgroundColor: '#F0F0F0'
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
