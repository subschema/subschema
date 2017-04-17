"use strict";

import React, {Component} from "react";
import {Form, PropTypes, ValueManager, DefaultLoader} from "Subschema";
import history from "./location";
import "./sample.lessp";

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
            setTimeout(()=> {
                if (loc == null || val == null) {
                    return;
                }
                if (val) {
                    if (loc.query[path] === 'true') return;
                    loc.query[path] = 'true';
                    var {pathname, query, state} = loc;
                    history.push({pathname, query, state});
                } else {
                    if (loc.query[path] === 'true') {
                        delete loc.query[path];
                        var {pathname, query, state} = loc;
                        history.push({pathname, query, state});
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
            this.props.valueManager.update('pathname', pathname);
            this.props.valueManager.update('useData', location.query.useData == "true");
            this.props.valueManager.update('useError', location.query.useError == "true");

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