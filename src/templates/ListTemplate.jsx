import React from 'react';
import css from '../css';

export default function ListTemplate(props) {
    return (<div className={props.className}>
        {props.renderAdd}
        <ul className={css.forField(this, 'input-list')}>
            {props.children}
        </ul>
    </div>);
}