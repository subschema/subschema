"use strict";

import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';

function loadContent(content, key, props, context) {
    const Content = context.loader.loadType('Content');
    return context.injector.inject(Content, null, {content});
}

export default function content(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::prop(key, loadContent);

};