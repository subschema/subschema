import React, {Component} from "react";
import {Form, PropTypes, ValueManager, DefaultLoader} from "subschema";
import history from "./location";
import "./sample.lessp";
import queryString from 'querystring';
console.log(`qs`,queryString);
export default class Demo extends Component {
    static propTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        schema: PropTypes.any,
        defaultLoaders: PropTypes.array
    };

    static childContextTypes = {
        defaultLoaders: PropTypes.array
    };

    static defaultProps = {
        valueManager: ValueManager(),
        defaultLoaders: [DefaultLoader]
    };

    getChildContext() {
        const {defaultLoaders} = this.props;
        return {
            defaultLoaders
        }
    }

    componentDidMount() {
        let loc;

        function handleDataError(val, old, path) {
            //make sure the poll cycle exists first;
            setTimeout(() => {
                if (loc == null || val == null) {
                    return;
                }
                const query = queryString.parse(loc.search) || {};
                if (val) {
                    if (query[path] === 'true') return;
                    query[path] = 'true';
                    var {pathname, state} = loc;
                    history.push({pathname, search: queryString.stringify(query), state});
                } else {
                    if (query[path] === 'true') {
                        delete query[path];
                        var {pathname, state} = loc;
                        history.push({pathname, search: queryString.stringify(query), state});
                    }
                }
            }, 20);

        }

        const hd = this.props.valueManager.addListener('useData', handleDataError, null, false).remove;
        const ed = this.props.valueManager.addListener('useError', handleDataError, null, false).remove;

//Handle change of state to showing data or error.

        // Listen for changes to the current location. The
        // listener is called once immediately.
        const unlisten = history.listen(location => {
            console.log('loc', location);
            const pathname = location.pathname;
            const query = queryString.parse(location.search);
            this.props.valueManager.update('pathname', pathname);
            this.props.valueManager.update('useData',  query.useData == "true");
            this.props.valueManager.update('useError', query.useError == "true");

            loc = location;

        });
        this.unlisten = function () {
            hd();
            ed();
            unlisten();
        }

    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return <Form valueManager={this.props.valueManager} schema={this.props.schema} loader={this.props.loader}
                     template="ObjectTemplate"/>
    }

}