var React = require('../react');
var ListInput = require('../types/List.jsx');
var css = require('../css');
var ListTemplate = React.createClass({

    render(){
        return (<div className={this.props.className}>
            {this.props.renderAdd}
            <ul className={css.forField(this, 'input-list')}>
                {this.props.children}
            </ul>
        </div>);
    }
});

module.exports = ListTemplate;