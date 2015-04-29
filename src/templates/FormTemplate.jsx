var React = require('../react');

var FormTemplate = React.createClass({

    render(){
        var {children, ...props} = this.props;
        return (<form {...props} >
            {children}
        </form>);
    }
});

module.exports = FormTemplate;