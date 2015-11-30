"use strict";
import React from 'react';
import Content from '../types/Content.jsx';
import styles from 'subschema-styles/RadioItemTemplate-style';

export default function RadioItemTemplate(props) {
    var {label, labelHTML,children, checked, checkedClass, id} = props;
    label = labelHTML ? labelHTML : label;
    checkedClass = checkedClass || '';
    label = typeof label === 'string' ? [{children: true}, label] : label;

    return (<div className={styles.namespace+' '+(checked ? checkedClass || styles.checked : styles.unchecked)}>
        <Content type='label' content={label}>
            {children}
        </Content>
    </div>);
}
