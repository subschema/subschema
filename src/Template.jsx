import React, {Component, Children} from 'react';
import PropTypes from './PropTypes';
import Content from './types/Content.jsx';
import {FREEZE_OBJ} from './tutils';
import Conditional from './Conditional.jsx';
import template from './decorators/template';
/**
 * This meta template resolves templates, and allows
 * properties to be assigned to a a template object.
 *
 * This resolves templates
 *
 * @type {*|Function}
 */
export default class Template extends Component {
    static propTypes = {
        path: PropTypes.path,
        template: PropTypes.template,
        wrap: PropTypes.bool
    }

    static contextTypes = PropTypes.contextTypes;

    @template('template')
    template(Template){
        return Template;
    }

    renderContent(rest, children) {
        var more = {};
        var Template = this.props.template ? this.template() : null;
        if (Template == null || Template === false) return children;

        if (rest.content) {
            Template = Content;
            more = typeof rest.content === 'string' ? {content: rest.content} : rest.content;
        }

        return this.props.wrap ? Children.map(children, (child)=><Template {...more} {...rest}>
            {child}
        </Template>) : <Template {...more} {...rest}>
            {children}
        </Template>

    }

    render() {
        var {field,  path, conditional, children, template,...props} = this.props;
        if (field && field.conditional) {
            var {conditional, ...rest} = field;
            field = props.field = rest;

        }

        if (conditional == null || conditional === false) {
            props.path = path;
            props.field = field;
            return this.renderContent(props, children);
        }
        if (typeof conditional === 'string') {
            conditional = {operator: conditional};
        }
        props.path = conditional.path || path;
        return (<Conditional path={props.path} {...conditional} field={field}>
            {this.renderContent(props, children)}
        </Conditional>);
    }
}