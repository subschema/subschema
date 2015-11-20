import React, {Component} from 'react';

export default class LazyType extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false};
    }

    componentWillMount() {
        var promise = this.props.promise;
        promise && promise.then(this.onResolve);
    }

    onResolve = (resolved) => {
        this.setState({resolved, loaded: true});
    }

    render() {
        if (this.state.loaded) {
            var Type = this.state.resolved;
            var {promise, ...props} = this.props;
            return <Type key="resolved" {...props}/>
        }
        return <span className="lazy-loading-type" key="unresolved"/>;
    }
}