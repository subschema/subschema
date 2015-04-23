var React = require('react');
var Router = require('react-router');
var { Link } = Router;

var SampleNav = React.createClass({
    clzName(name, active){
        return 'list-group-item ' + (name === active ? 'active' : '');
    },
    renderItems: function () {
        var clzName = this.clzName;
        var sample = this.props.activeSample;
        return this.props.samples.map(function (item) {
            return (
                <Link to="item" className={clzName(item.name, sample)} key={item.name}
                      params={{sample: item.name}}>{item.name}</Link>
            );
        });
    },

    render: function () {
        return (

            <div className="list-group left-nav">
                {this.renderItems()}
            </div>
        );
    }
});
module.exports = SampleNav;