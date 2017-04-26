import React from 'react';
import Navigate from "./components/Navigate.jsx";
import NavTemplate from "./components/NavTemplate.jsx";
import ULTemplate from "./components/ULTemplate.jsx";
import Link from "./components/Link.jsx";
import LiLink from "./components/LiLink.jsx";
import Main from "./components/Main.jsx";
import Example from "./components/Example.jsx";
import NotFound from "./components/NotFound.jsx";
import UpdateValue from "./components/UpdateValue.jsx";
import Submit from "./components/Submit.jsx";

export const types = {
    NotFound,
    Navigate,
    Link,
    Main,
    Example,
    LiLink, UpdateValue, Submit
};
export const templates = {
    NavTemplate,
    ULTemplate,
    H3(props){
        return <h3>{props.legend || props.children}</h3>
    }
};

export default ({types, templates});