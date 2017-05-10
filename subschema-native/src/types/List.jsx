import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {style} from '../PropTypes';
import {ListView, TouchableHighlight, StyleSheet, Text, View} from 'react-native';
import {List as ListDom} from 'subschema-component-list';
import {RenderTemplate} from 'subschema-core';

export default class ListType extends ListDom {
    static defaultProps = {
        ...ListDom.defaultProps,
        buttons: {
            buttonsClass: 'btn-group pull-right',
            buttons: [{label: 'Cancel', action: 'cancel', buttonClass: 'btn btn-default'}
                , {label: 'Save', type: 'submit', action: 'submit', buttonClass: 'btn-primary btn'}]
        }
    };
    state = {};

    componentWillReceiveProps(props) {
        this._updateDS(props.value);
    }

    componentWillMount() {
        this._updateDS(this.props.value);
    }

    _updateDS(value) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(value || []),
        });
    }

    _renderRow = (rowData, sectionId, rowId) => {
        return this.renderRow(rowData, sectionId, parseInt(rowId));

    };

    _pressRow(rowId) {
        this.setState({editPid: rowId});
    }


    render() {
        return (<View>
            {this.renderAdd()}
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
            />
        </View>)
    }
}
