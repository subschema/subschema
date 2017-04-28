import React from 'react';
import Example from "./components/Example.jsx";
import UpdateValue from "./components/UpdateValue.jsx";
import Submit from "./components/Submit.jsx";

export const types = {
    Example,
    UpdateValue, Submit
};
export const templates = {

    H3(props){
        return <h3>{props.legend || props.children}</h3>
    }
};

export default ({types, templates});