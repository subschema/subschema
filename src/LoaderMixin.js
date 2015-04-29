var loader = require('./loader');
var LoaderMixin = {
    getDefaultProps(){
        return {
            loader: loader
        }
    },
    template(name){
        name = name || 'template';
        if (this.props.field && (name in this.props.field)) {
            return this.props.loader.loadTemplate(this.props.field[name], this.props.field);
        }
        if (name in this.props) {
            return this.props.loader.loadTemplate(this.props[name], this.props);
        }
        throw 'Template could not be found "' + name + '"';
    }

}
module.exports = LoaderMixin;