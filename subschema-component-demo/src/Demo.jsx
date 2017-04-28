import React, {Component} from "react";
import {NavigationForm} from 'subschema-component-navigation';
import history from "./location";
import "./sample.lessp";
export default (props) => (<NavigationForm history={history} template="ObjectTemplate" {...props}/>);
