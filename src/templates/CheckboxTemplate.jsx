import React from 'react';
import Content from '../types/Content.jsx';
import style  from 'subschema-styles/CheckboxTemplate-style';
function CheckboxTemplate(props){
        return (<div className={style.checkbox}>
            <label>
                {props.children}
                {props.label}
            </label>
        </div>);
}
export default CheckboxTemplate;