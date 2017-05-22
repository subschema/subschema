import React from 'react';
import DomCheckboxes from 'subschema-component-form/lib/types/Checkboxes';
import {View, Text, Switch} from 'react-native';
import PropTypes from 'subschema-prop-types';
import {styleClass} from '../PropTypes';
import {path} from 'subschema-utils';
import RenderTemplate from 'subschema-core/lib/RenderTemplate';

export default class Checkboxes extends DomCheckboxes {



    //override added input Class Names.
    static inputClassName = ' ';

    static propTypes = {
        ...DomCheckboxes.propTypes,
        groupTemplate: PropTypes.any,
        className: styleClass
    };

    static defaultProps = {
        ...DomCheckboxes.defaultProps,
        //make the value an array regardless of input
        value: {
            processor: 'ArrayProcessor'
        },
        itemTemplate: 'RadioItemTemplate'
    };


    handleCheckChange = (checked, value) => {
        const newValues = this.props.value.concat();
        const idx = newValues.indexOf(value);

        if (checked) {
            if (idx < 0)
                newValues.push(value);
        } else {
            if (idx > -1)
                newValues.splice(idx, 1);
        }

        this.props.onChange(newValues);
        this.props.onBlur();

    };


    _createCheckbox(option, index, group) {

        const id = path(this.props.path, group, index);
        let {val, label} = option;
        val = val == null ? label : val;
        const value = this.props.value;
        const RadioItemTemplate = this.props.itemTemplate;
        const opts = {
            onChange: (checked) => this.handleCheckChange(checked, val),
            name: group,
            value: value ? !!~value.indexOf(val) : false,
            id,
            label: label || val
        };
        return (<RenderTemplate template={this.props.itemTemplate} key={`checkbox-${index}-${group}`} {...opts}>
            <Switch {...opts}/>
        </RenderTemplate>);
    }

    _createGroup(option, index, group) {
        const {name, value, ...rest} = this.props;
        return (<View key={`checkbox-group-${index}-${option.group}`}>
            <Text>{option.legend || option.group}</Text>
            {this.makeOptions(option.options, group + '-' + index)}
        </View>);
    }


    /**
     * Create the checkbox list HTML
     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     * @return {String} HTML
     */
    makeOptions(array, group) {
        return array.map((option, index) => option.group ? this._createGroup(option, index, group) : this._createCheckbox(option, index, group));
    }


    render() {

        return <View style={this.props.className}>{this.makeOptions(this.props.options, this.props.path)}</View>
    }
}