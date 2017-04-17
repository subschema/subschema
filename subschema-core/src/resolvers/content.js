"use strict";

import PropTypes from '../PropTypes';
import UninjectedContent from '../types/Content';

export const settings = {
    Content: UninjectedContent
};
export function loadContent(content, key, props, {injector}) {
    if (content === false || content == null) {
        return null;
    }
    const Content = injector.inject(settings.Content);
    return {
        Content: Content,
        content: content
    }
}

export default function content(Clazz, key) {

    Clazz.contextTypes.injector = PropTypes.injector;
    Clazz::this.property(key, loadContent);

};
