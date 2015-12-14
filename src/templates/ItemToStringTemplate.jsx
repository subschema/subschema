import React from 'react';
import style  from 'subschema-styles/ItemToStringTemplate-style';

export default function ItemToStringTemplate(props) {
    var {value, labelKey} = props;
    if (labelKey) {
        return <span className={style.label}>{value[labelKey] || ''}</span>;
    }
    return <span className={style.label}>{value == null ? null : value + ''}</span>;
}
