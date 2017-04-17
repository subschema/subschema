"use strict";

import React from "react";

/**
 * This is to be used to render properties with type content.
 * Just a convient wrapper so that things go well.
 *
 * @param props
 * @returns {*}
 * @constructor
 */

function RenderContent(props) {
    if (props == null) {
        return props;
    }

    const {content, type, ...oprops} = props;
    const {Content, ...rest} = content;
    return <Content content={rest} {...oprops}/>
}
RenderContent.displayName = 'RenderContent';
export default RenderContent;