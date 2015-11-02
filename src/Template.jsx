var React = require('./react');
var Children = React.Children;
var PropTypes = require('./PropTypes');
var Content = require('./types/Content.jsx');
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
    render(){
        var {template, children, ...rest} = this.props, more = {};

        if (template == null || template === false) return children;

        if (typeof template === 'string') {
            var Template = this.context.loader.loadTemplate(this.props.template);
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

    }
});

module.exports = Template;