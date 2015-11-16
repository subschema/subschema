"use strict";
import warning from '../warning';
import PropTypes from '../PropTypes'
import loader from '../loader';

function loadTemplate(loader, template, key) {
    if (template === false) return null;
    warning(template, 'There was no template for %s in props', key);
    var ret = loader.loadTemplate(template);
    warning(ret, 'Could not find templtate "%s" in loader', template);
    return ret;
}
export default function (property = "template", ...rest) {
    if (typeof property === 'string') {
        rest.unshift(property);
        return template$wrap;
    } else {
        var target = property, name = rest.shift(), description = rest.shift();
        rest = ['template']
        template$wrap(target, name, description);
    }

    function template$wrap(target, name, description) {
        var loader = this.context.loader || loader;
        var ofunc = description.value;
        description.value = function (...args) {
            var props = this.props, loader = this.context.loader;
            var tmpl = rest.map((v)=>loadTemplate(loader, props[v], v));

            return ofunc.apply(this, tmpl.concat(args));
        }

    }
}