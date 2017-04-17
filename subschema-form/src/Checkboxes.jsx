"use strict";

import React, {Component} from "react";
import PropTypes from "../PropTypes";
import {path, FREEZE_ARR as options} from "../tutils";
import RenderTemplate from "../components/RenderTemplate";

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
        dataType: PropTypes.dataType,
        onBlur: PropTypes.changeValidate
    };

    static defaultProps = {
        options,
        item: 'Text',
        itemTemplate: 'CheckboxesTemplate',
        groupTemplate: 'CheckboxesGroupTemplate',
        //make the value an array regardless of input
        value: {
            processor: 'ArrayProcessor'
        },
        dataType: "checkbox"
    };


    handleCheckChange = (e)=> {
        if (this.props.dataType === 'radio') {
            this.props.onChange(e.target.checked ? e.target.value : null);
            if (this.props.onBlur) {
                this.props.onBlur();
            }
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
        this.props.onBlur();

    }


    _createCheckbox(option, index, group) {

        const id = path(this.props.path, group, index);
        let {val, labelHTML, label} = option;
        val = val == null ? label || labelHTML : val;
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
        return (
            <RenderTemplate template={this.props.itemTemplate} key={`checkbox-${index}-${group}`} label={labelContent}
                            type="checkbox" {...opts}>
                <input type={this.props.type} {...opts}/>
            </RenderTemplate>);

    }

    _createGroup(option, index, group) {
        const {Checkboxes, groupTemplate, name, value, ...rest} = this.props;
        return (<RenderTemplate template={groupTemplate} key={`checkbox-group-${index}-${option.group}`}
                                legend={option.legend || option.group}>
            {this.makeOptions(option.options, group + '-' + index)}
        </RenderTemplate>);
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
