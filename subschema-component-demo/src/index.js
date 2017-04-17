"use strict";
import React from "React";
import {loaderFactory} from "Subschema";
import Navigate from "./components/Navigate.jsx";
import NavTemplate from "./components/NavTemplate.jsx";
import ULTemplate from "./components/ULTemplate.jsx";
import Link from "./components/Link.jsx";
import LiLink from "./components/LiLink.jsx";
import Main from "./components/Main.jsx";
import Example from "./components/Example.jsx";
import NotFound from "./components/NotFound.jsx";
import UpdateValue from "./components/UpdateValue.jsx";
import validateNpmPkgName from "validate-npm-package-name";
import Submit from "./components/Submit.jsx";

const loader = loaderFactory();

loader.addType({
    NotFound,
    Navigate,
    Link,
    Main,
    Example,
    LiLink, UpdateValue, Submit
});
loader.addTemplate({
    NavTemplate,
    ULTemplate,
    H3(props){
        return <h3>{props.legend || props.children}</h3>
    }
});
loader.addValidator({
    npm_validate(options) {
        options = options || {};
        if (!options.message) {
            options.message = "Invalid Package Name"
        }
        if (!options.validType) {
            options.validType = 'validForNewPackages'
        }
        return function package_name$validator(value) {
            if (!validateNpmPkgName(value)[options.validType]) {
                return {
                    message: options.message
                }
            }
        }
    }
});
export default loader;