const React = require('react');
const LazyType = React.createClass({
    mixins: [require('../LoaderMixin')],
    getInitialState(){
        return {
            loaded: false
        }
    },
    componentWillMount(){

        var promise = this.props.promise;
        promise && promise.then(this.onResolve);

    },
    onResolve(resolved){
        this.setState({resolved, loaded: true});
    },
    render(){
        if (this.state.loaded) {
            var Type = this.state.resolved;
            var {promise, ...props} = this.props;
            return <Type key="resolved" {...props}/>
        }
        return <span className="lazy-loading-type" key="unresolved"/>;
    }
});
module.exports = LazyType;