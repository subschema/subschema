import React from 'react';

/**
 * This is to be used to render properties with type content.
 * Just a convient wrapper so that things go well.
 *
 * @param props
 * @returns {*}
 * @constructor
 */

function RenderContent(props) {
    if (props == null || props.content == null) {
        return null;
    }

    const { content: { Content, ...content }, type, ...oprops } = props;

    return <Content content={content} {...oprops}/>
}
RenderContent.displayName = 'RenderContent';
export default RenderContent;
