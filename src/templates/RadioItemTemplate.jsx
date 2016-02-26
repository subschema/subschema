"use strict";
import React, {Component} from 'react';
import Content from '../types/Content.jsx';
import styles from 'subschema-styles/RadioItemTemplate-style';
import PropTypes from '../PropTypes';

export default class RadioItemTemplate extends Component {
    static propTypes = {
        label: PropTypes.any,
        labelHTML: PropTypes.any,
        checked: PropTypes.bool,
        checkedClass: PropTypes.string,
        id: PropTypes.id,
        Content: PropTypes.injectClass
    };

    static defaultProps = {
        Content: Content
    };

    render() {
        let {label, labelHTML,children, checked, checkedClass, id} = this.props;
        label = labelHTML ? labelHTML : label;
        checkedClass = checkedClass || '';
        label = typeof label === 'string' ? [{children: true}, label] : label;
        return (<div className={styles.namespace+' '+(checked ? checkedClass || styles.checked : styles.unchecked)}>
            <Content type='label' content={label}>
                {children}
            </Content>
        </div>);
    }
}
