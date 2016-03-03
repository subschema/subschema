"use strict";

import React from 'react';

/**
 * This is to be used to render properties with type content.
 * Just a convient wrapper so that things go well.
 *
 * @param props
 * @returns {*}
 * @constructor
 */

export default function RenderContent(props) {
    if (props == null) {
        return props;
    }

    const {content, ...oprops} = props;

    if (content === false) {
        return null
    }

    const {Content, ...rest} = content;

    return <Content content={rest} {...oprops}/>
}
