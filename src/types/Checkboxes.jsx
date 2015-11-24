"use strict";

import React, {Component} from 'react'
import Constants from '../Constants'
import PropTypes from '../PropTypes'
import template from '../decorators/template';
import tu, {path, toArray, FREEZE_ARR,returnFirst,  isArray} from '../tutils';

export default class Checkboxes extends Component {
    static eventValue = returnFirst;

    static inputClassName = ' ';
    static propTypes = {
        options: PropTypes.options,
        itemTemplate: PropTypes.template,
        groupTemplate: PropTypes.template,
    }

    static defaultProps = {
        options: FREEZE_ARR,
        itemTemplate: 'CheckboxesTemplate',
        groupTemplate: 'CheckboxesGroupTemplate',
    }

    constructor(props, ...rest) {
        super(props, ...rest);
        var state = this.state || (this.state = {});
        state.value = props.value == null ? FREEZE_ARR : toArray(props.value)
    }


    componentWillReceiveProps(newProps) {
        if (newProps.value !== this.props.value) {
            this.setState({value: newProps.value == null ? FREEZE_ARR : toArray(newProps.value)});
        }
    }

    handleCheckChange = (e)=> {
        var newValues = (this.state.value).concat();
        if (e.target.checked) {
            newValues.push(e.target.value);
        } else {
            newValues.splice(newValues.indexOf(e.target.value), 1);
        }

        this.props.onChange(newValues);
    }


    _createCheckbox(option, index, group, CheckboxTemplate) {


        var id = path(this.props.path, index, group);
        var {val, labelHTML} = option;
        var value = this.state.value;
        var labelContent = labelHTML ? <span dangerouslySetInnerHTML={{__html:labelHTML}}/> : val;
        var opts = {
            onChange: this.handleCheckChange,
            name: this.props.name,
            checked: value ? !!~value.indexOf(val) : false,
            id,
            value: val
        }
        return (<CheckboxTemplate label={labelContent} {...opts}>
            <input type="checkbox" {...opts}/>
        </CheckboxTemplate>);

    }

    _createGroup(option, index, group, Template, CheckboxTemplate) {
        return <Template group={option.group}>
            {this.makeOptions(option.options, group == null ? 0 : group, CheckboxTemplate)}
        </Template>

    }


    /**
     * Create the checkbox list HTML
     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     * @return {String} HTML
     */
    @template('itemTemplate', 'groupTemplate')
    makeOptions(CheckboxTemplate, CheckboxesGroupTemplate, array, group) {
        array = array || FREEZE_ARR;
        var name = this.props.name;
        return array.map((option, index)=> {
            return (
                <div
                    key={name+'-'+option.val+'-'+group}>{ option.group ? this._createGroup(option, index, group ? group++ : 0, CheckboxesGroupTemplate, CheckboxTemplate) : this._createCheckbox(option, index, group, CheckboxTemplate)}</div>)

        });
    }

    render() {

        return <div
            className={this.props.className}>{this.makeOptions(this.props.options, 1)}</div>
    }
}
