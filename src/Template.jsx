var React = require('./React');
var Children = React.Children;
var PropTypes = require('./PropTypes');
var Content = require('./types/Content.jsx');
var Conditional = require('./Conditional.jsx');
/**
 * This meta template resolves templates, and allows
 * properties to be assigned to a a template object.
 *
 * This resolves templates
 *
 * @type {*|Function}
 */
var Template = React.createClass({
    propTypes: {
        path: PropTypes.path.isRequired,
        template: PropTypes.template,
        wrap: PropTypes.bool
    },
    contextTypes: {
        loader: PropTypes.loader.isRequired
    },
    renderContent(rest, template, children){
        if (template == null || template === false) return children;

        if (typeof template === 'string') {
            var Template = this.context.loader.loadTemplate(template);
        } else if (typeof template.template === 'string') {
            var {template, ...more} = template;
            var Template = this.context.loader.loadTemplate(template.template);
        } else if (template.content) {
            Template = Content;
            more = typeof template.content === 'string' ? {content: template.content} : template.content;
        }
        return this.props.wrap ? Children.map(children, (child)=><Template {...more} {...rest}>
            {child}
        </Template>) : <Template {...more} {...rest}>
            {children}
        </Template>

    },
    render(){
        var {field,  path, conditional, children, template,...props} = this.props;
        conditional = conditional || field.conditional;
        if (conditional == null || conditional === false) {
            props.path = path;
            props.field = field;
            return this.renderContent(props, template, children);
        }
        if (typeof conditional === 'string') {
            conditional = {operator: conditional};
        }
        props.path = conditional.path || path;
        return (<Conditional path={this.props.path} {...conditional} field={field}>
            {this.renderContent(props, template, children)}
        </Conditional>);
    }
});

module.exports = Template;