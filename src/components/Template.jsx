import React, {Component, Children} from 'react';
import PropTypes from './../PropTypes';
import {FREEZE_OBJ} from './../tutils';
import UninjectedConditional from './Conditional.jsx';
import UninjectedContent from './../types/Content.jsx';

/**
 * This meta template resolves templates, and allows
 * properties to be assigned to a a template object.
 *
 * This resolves templates
 *
 * @type {*|Function}
 */
class Template extends Component {
    static propTypes = {
        path: PropTypes.path,
        template: PropTypes.template,
        wrap: PropTypes.bool,
        Conditional: PropTypes.injectClass,
        Content: PropTypes.injectClass
    };
    static defaultProps = {
        Conditional: UninjectedConditional,
        Content: UninjectedContent
    };


    renderContent(rest, children) {
        var more = {};
        let {Template, Content, ...rest} = this.props;
        if (Template == null || Template === false) return children;

        if (rest.content) {
            Template = Content;
            more = typeof rest.content === 'string' ? {content: rest.content} : rest.content;
        }

        return this.props.wrap ? Children.map(children, (child)=><Template field={rest} {...more} {...rest}>
            {child}
        </Template>) : <Template field={rest} {...more} {...rest}>
            {children}
        </Template>

    }

    render() {
        var {field,  path, conditional, Conditional, children, template,...props} = this.props;
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

export default Template;