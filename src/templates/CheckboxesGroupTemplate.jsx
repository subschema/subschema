import React from 'react';
import style from 'subschema-styles/CheckboxesGroupTemplate-style';

function CheckBoxGroupTempalte(props){
    return (<fieldset className={style.group}>
          <legend>{props.group}</legend>
            {props.children}
        </fieldset>);
};

export default CheckBoxGroupTempalte;