var React = require('react');
var Children = React.Children;
var PropTypes = require('./PropTypes');
var ValueManager = require('./ValueManager');
var NewChildContext = React.createClass({
    propTypes: {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        path: PropTypes.string.isRequired
    },
    childContextTypes: {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        parentValueManager: PropTypes.valueManager
    },
    getDefaultProps(){
        return {
            resolve(path){
                this.valueManager.path(path)
            }
        }
    },
    getChildContext: function () {
        var parentValueManager = this.props.valueManager;
        var {loader,path} = this.props;
        var {...value} = this.props.value || parentValueManager.path(path);
        var valueManager = this.valueManager = ValueManager(value, parentValueManager.getErrors());
        this._submit = parentValueManager.addSubmitListener(null, this.handleSubmit, this, false);
        return {valueManager, parentValueManager, loader};
    },
    componentWillUnmount(){
        this._submit && this._submit.remove();
    },
    handleSubmit(e){
        //t(e, vm.getErrors(), vm.getValue(), this.props.path)
        var value = this.props.resolve(this.valueManager.getValue()), errors = this.valueManager.getErrors();

        if (this.props.onSubmit) {
            if (this.props.onSubmit(e, errors, value, this.props.path) !== false) {
                this.props.valueManager.update(this.props.path, value);
            }
        } else {
            this.props.valueManager.update(this.props.path, value);
        }
        return false;
    },

    render(){
        return React.cloneElement(this.props.children, {onSubmit: this.handleSubmit});
    }
});
module.exports = NewChildContext;