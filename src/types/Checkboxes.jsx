"use strict";

import React, {Component} from 'react'
import Constants from '../Constants'
import PropTypes from '../PropTypes'
import tu, {path, toArray, FREEZE_ARR,returnFirst,  isArray} from '../tutils';

export default class Checkboxes extends Component {
    //override added input Class Names.
    static inputClassName = ' ';

    static propTypes = {
        onChange: PropTypes.valueEvent,
        options: PropTypes.options,
        item: PropTypes.type,
        name: PropTypes.string,
        itemTemplate: PropTypes.template,
        groupTemplate: PropTypes.template,
        path: PropTypes.path,
        dataType: PropTypes.dataType
    };

    static defaultProps = {
        options: FREEZE_ARR,
        item: 'Text',
        itemTemplate: 'CheckboxesTemplate',
        groupTemplate: 'CheckboxesGroupTemplate',
        //make the value an array regardless of input
        value: {
            processor: toArray
        },
        dataType: "checkbox"
    };


    handleCheckChange = (e)=> {
        if (this.props.dataType === 'radio') {
            this.props.onChange(e.target.checked ? e.target.value : null);
            return;
        }
        var newValues = this.props.value.concat();
        const idx = newValues.indexOf(e.target.value);

        if (e.target.checked) {
            if (idx < 0)
                newValues.push(e.target.value);
        } else {
            if (idx > -1)
                newValues.splice(idx, 1);
        }

        this.props.onChange(newValues);
    };


    _createCheckbox(option, index, group) {

        const CheckboxTemplate = this.props.itemTemplate;
        const id = path(this.props.path, group, index);
        var {val, labelHTML, label} = option;
        label = labelHTML || label;
        const value = this.props.value;
        const labelContent = label ? <span dangerouslySetInnerHTML={{__html:label}}/> : val;
        const opts = {
            onChange: this.handleCheckChange,
            name: group,
            checked: value ? !!~value.indexOf(val) : false,
            id,
            value: val
        };
        return (<CheckboxTemplate key={`checkbox-${index}-${group}`} label={labelContent} type="checkbox" {...opts}>
            <input type={this.props.type} {...opts}/>
        </CheckboxTemplate>);

    }

    _createGroup(option, index, group) {
        const {Checkboxes, groupTemplate, name, value, ...rest} = this.props;
        const GroupTemplate = groupTemplate;
        return (<GroupTemplate key={`checkbox-group-${index}-${option.group}`} legend={option.legend || option.group}>
            {this.makeOptions(option.options, group + '-' + index)}
        </GroupTemplate>);
    }


    /**
     * Create the checkbox list HTML
     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     * @return {String} HTML
     */
    makeOptions(array, group) {
        return array.map((option, index)=> option.group ? this._createGroup(option, index, group) : this._createCheckbox(option, index, group));
    }


    render() {

        return <div className={this.props.className}>{this.makeOptions(this.props.options, this.props.path)}</div>
    }
}
