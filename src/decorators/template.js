"use strict";
import warning from '../warning';
import PropTypes from '../PropTypes'
import loader from '../loader';

function loadCtx(v) {
    if (v === false) {
        return null;
    }
    var template = this.props[v];
    warning(template, 'There was no template for %s in props', v);

    if (typeof template !== 'string') {
        return template;
    }

    template = this.context.loader.loadTemplate(template);

    warning(template, 'There was no template for %s in the loader', template);

    return template;
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
export default function template(property = "template", ...rest) {
    if (typeof property === 'string') {
        rest.unshift(property);
        return template$wrap;
    } else {
        var target = property, name = rest[0], description = rest[1];
        rest = ['template']
        return template$wrap(target, name, description);
    }

    function template$wrap(target, name, description) {
        var Target = target.constructor || target;
        var contextTypes = Target.contextTypes;
        if (!contextTypes) {
            Target.contextTypes = {loader: PropTypes.loader};
        } else if (!Target.contextTypes.loader) {
            Target.contextTypes.loader = PropTypes.loader;
        }
        var ofunc = description.value;
        description.value = function template$wrap$value(...args) {
            var props = this.props, loader = this.context.loader;
            var tmpl = rest.map(loadCtx, this);

            return ofunc.apply(this, tmpl.concat(args));
        }
        return description;

    }
}