import React from 'react';
import { FREEZE_OBJ, warning } from 'subschema-utils';
import PropTypes from 'subschema-prop-types';

/**
 * This is to be used to render properties with templates.
 * Just a convient wrapper so that things go well.
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function renderButtons({ template, ...rest }) {
    const { Template, ...trest } = template;
    return <Template {...trest} {...rest}/>
}

function RenderTemplate(props) {

    let { children, buttons, template = FREEZE_OBJ, ...rest } = props;
    let Template;
    if (template === false || template == null) {
        return children;
    } else if (typeof template === 'function') {
        Template = template;
        template = FREEZE_OBJ;
    } else {
        ({ Template, ...template } = template);
    }
    if (buttons && Template && Template.Clazz && Template.Clazz.propTypes) {
        const { propTypes } = Template.Clazz;
        if (propTypes.buttons === PropTypes.node) {
            warning(false,
                'PropTypes.node is deprecated  either PropTypes.renderedTemplate or PropTypes.buttons please see "%s"',
                Template.Clazz.displayName);
        }

        if (propTypes.buttons != PropTypes.buttons) {
            buttons = renderButtons(buttons);
        }
    }

    return <Template {...template} {...rest}
                     buttons={buttons}>{children}</Template>
}

RenderTemplate.displayName = 'RenderTemplate';
export default RenderTemplate;
