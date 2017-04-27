import React, {Component} from "react";
import {Form, PropTypes, ValueManager, DefaultLoader} from "subschema";
import history from "./location";
import "./sample.lessp";
import queryString from 'querystring';
function parse(loc) {
    if (loc.search) {
        const ret = queryString.parse(loc.search.replace(/^\?+?/, ''));
        console.log(loc.search, ret);
        return ret;
    }
    return {};
}
function search(query) {
    return `?${queryString.stringify(query)}`;

}
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

    handleDataError = (val, old, path) => {
        console.log('change', val, old, path);
        const loc = this.location;
        //make sure the poll cycle exists first;
        clearTimeout(this._to);
        this._to = setTimeout(() => {
            if (loc == null || val == null) {
                return;
            }
            const query = parse(loc);
            if (val) {
                if (query[path] === 'true') return;
                query[path] = 'true';
                var {pathname, state} = loc;
                history.push({pathname, search: search(query), state});
            } else {
                if (query[path] === 'true') {
                    delete query[path];
                    var {pathname, state} = loc;
                    history.push({pathname, search: search(query), state});
                }
            }
        }, 100);
    };

    componentWillMount() {
        if (this.unlisten) this.unlisten();

        const hd = this.props.valueManager.addListener('useData', this.handleDataError, null, false).remove;
        const ed = this.props.valueManager.addListener('useErrors', this.handleDataError, null, false).remove;

//Handle change of state to showing data or error.
        this._listenToHistory(history.location);
        // Listen for changes to the current location. The
        // listener is called once immediately.
        const unlisten = history.listen(this._listenToHistory);
        this.unlisten = function () {
            hd();
            ed();
            unlisten();
        }

    }

    _listenToHistory = (location) => {
        console.log('loc', location);
        const pathname = location.pathname;
        const query = parse(location);
        this.props.valueManager.update('pathname', pathname);
        this.props.valueManager.update('useData', query.useData == "true");
        this.props.valueManager.update('useErrors', query.useErrors == "true");
        this.location = location;
    };

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return <Form valueManager={this.props.valueManager} schema={this.props.schema} loader={this.props.loader}
                     template="ObjectTemplate"/>
    }

}