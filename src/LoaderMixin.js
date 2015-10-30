var  util = require('./tutils'), loader = require('./loader'), PropTypes = require('./PropTypes');

var LoaderMixin = {
    contextTypes: {
        loader: PropTypes.loader
    },

    template(template){
        template = arguments.length ? template : 'template';
        template = (this.props.field && (template in this.props.field)) ? this.props.field[template] : (template in this.props) ? this.props[template] : template;
        if (util.isString(template)) {
            return this.context.loader.loadTemplate(template, this.props);
        }
        return template === false ? null : template;
    }
    ,
    processor(processor){
        processor = arguments.length ? processor : 'processor';
        processor = (this.props.field && (processor in this.props.field)) ? this.props.field[processor] : (processor in this.props) ? this.props[processor] : processor;
        if (util.isString(processor)) {
            return this.context.loader.loadProcessor(processor, this.props);
        }
        return processor === false ? null : processor;
    }

}
module.exports = LoaderMixin;