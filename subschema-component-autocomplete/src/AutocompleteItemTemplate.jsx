"use strict";
import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class AutocompleteItemTemplate extends Component {
    static defaultProps = {
        data: null,
        value: null,
        focus: false,
        processor: null
    };

    static propTypes = {
        onSelect: PropTypes.event,
        style: PropTypes.style
    };


    handleClick = (e)=> {
        e && e.preventDefault();
        this.props.onSelect(this.props.data);
    };

    render() {
        const {data, focus, itemClass, focusedClass, value, processor} = this.props;
        const __html = processor.format(data, value, true);
        return __html == null ? null :
            <li ref="item" className={ `${itemClass}  ${focus ? focusedClass : ''}`} onClick={this.handleClick}
                dangerouslySetInnerHTML={{__html}}/>
    }
}
