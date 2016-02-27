"use strict";
import React, {Component} from 'react';
import Content from '../types/Content.jsx';
import PropTypes from '../PropTypes';

export default class RadioItemTemplate extends Component {
    static propTypes = {
        label: PropTypes.any,
        labelHTML: PropTypes.any,
        checked: PropTypes.bool,
        checkedClass: PropTypes.string,
        id: PropTypes.id,
        Content: PropTypes.injectClass,
        style: PropTypes.style
    };

    static defaultProps = {
        Content: Content
    };

    render() {
        let {label,namespaceClass, labelHTML,children, checked, checkedClass, uncheckedClass, id} = this.props;
        label = labelHTML ? labelHTML : label;
        checkedClass = checkedClass || '';
        label = typeof label === 'string' ? [{children: true}, label] : label;
        return (<div className={`${namespaceClass} ${checked ? checkedClass : uncheckedClass}`}>
            <Content type='label' content={label}>
                {children}
            </Content>
        </div>);
    }
}
