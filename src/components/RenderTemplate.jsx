"use strict";

import React from 'react';
import {FREEZE_OBJ} from '../tutils';

/**
 * This is to be used to render properties with templates.
 * Just a convient wrapper so that things go well.
 *
 * @param props
 * @returns {*}
 * @constructor
 */

function RenderTemplate(props) {

    let {children, template=FREEZE_OBJ, ...rest} = props;
    let Template;
    if (template === false || template == null) {
        return children;
    } else if (typeof template === 'function') {
        Template = template;
        template = FREEZE_OBJ;
    } else {
        ({Template, ...template} = template);
    }

    return <Template {...template} {...rest}>{children}</Template>
}

RenderTemplate.displayName = 'RenderTemplate';
export default RenderTemplate;