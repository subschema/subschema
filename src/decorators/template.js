"use strict";
import React, {Component} from 'react';
import warning from '../warning';
import PropTypes from '../PropTypes'
import decorator from './decorator';
import Content from '../types/Content.jsx'

function loadCtx(v) {
    if (v === false) {
        return null;
    }
    warning(this.context, 'context.loader was not injected in %s "%s"!', this.constructor.name, v);

    if (typeof v === 'string') {
        var props = this.props;

        var tmpl = props && props.field && props.field[v] || props[v];

        warning(tmpl, 'There was no template for "%s" in props or in props.field on component "%s"', v, this.constructor.name);

        //allow for singly nested templates to be resolved.
        if (tmpl && typeof tmpl.template === 'string') {
            tmpl = this.context.loader.loadTemplate(tmpl.template);
        } else if (typeof tmpl === 'string') {
            tmpl = this.context.loader.loadTemplate(tmpl);
        }

        if (!tmpl) {
            warning(false, 'There was no template for property "%s" in the loader named "%s" on component "%s"', v, props && props.field && props.field[v] || props[v], this.constructor.name);
        }
        return tmpl;
    }
    return template.Template;
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
const DEFAULT_TEMPLATE_PROP = ["template"];
const template = decorator(function template$inner(...rest) {
    if (rest == null || rest.length === 0) {
        rest = DEFAULT_TEMPLATE_PROP;
    }
    return function template$config(target, name, description) {
        var Target = target.constructor || target;
        var contextTypes = Target.contextTypes;
        if (!contextTypes) {
            Target.contextTypes = {loader: PropTypes.loader};
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
});

export default template;