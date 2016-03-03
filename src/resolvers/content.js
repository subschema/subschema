"use strict";

import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import UninjectedContent from '../types/Content.jsx';

export const settings = {
    Content: UninjectedContent
};
export function loadContent(content, key, props, {injector}) {

   const Content =  injector.inject(settings.Content);
   return {
       Content:Content,
       content:content
   }
}

export default function content(Clazz, key) {

    Clazz.contextTypes.injector = PropTypes.injector;
    Clazz::prop(key, loadContent);

};