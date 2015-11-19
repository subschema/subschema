"use strict";
import warning from '../warning';
import PropTypes from '../PropTypes'
import decorator from './decorator';
import Template from '../Template.jsx';

function loadCtx(v) {
    if (v === false) {
        return null;
    }
    
    if (typeof v === 'string') {
        var props = this.props;
        var template = props && props.field && props.field[v] || props[v];

        warning(template, 'There was no template for %s in props or in props.field on component %s', v, this.constructor.name);

        if (typeof template !== 'string') {
            return template;
        }
        warning(this.context, 'context.loader was not injected in %s!', this.constructor.name);

        template = this.context.loader.loadTemplate(template);

        warning(template, 'There was no template for %s in the loader', template);
        return template;
    }
    return Template;
}
/**
 * This injects a template into your method.  It can take variable length
 * of strings, or objects.  Objects will be returned, strings will be
 * resolved against the loader in the corrent context.
 *
 * @param property
 * @param rest
 * @returns {template$wrap}
 */
function template(property = "template", ...rest) {
    return function template$config(target, name, description) {
        var Target = target.constructor || target;
        var contextTypes = Target.contextTypes;
        if (!contextTypes) {
            Target.contextTypes = { loader: PropTypes.loader };
        } else if (!Target.contextTypes.loader) {
            Target.contextTypes.loader = PropTypes.loader;
        }
        var ofunc = description.value;
        description.value = function template$config$value(...args) {
            var props = this.props, loader = this.context.loader;
            var tmpl = rest.map(loadCtx, this);

            return ofunc.apply(this, tmpl.concat(args));
        }
        return description;

    }
}

export default decorator(template);