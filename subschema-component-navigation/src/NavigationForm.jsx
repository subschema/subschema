import React, { Component } from 'react';
import { Form } from 'subschema-core';
import HistoryTypes from './PropTypes';
import qs from 'querystring';


function parse(search = '') {
    return qs.parse(search.replace(/^\?+?/, ''));
}

export default class NavigationForm extends Form {
    static propTypes = {
        ...Form.propTypes,
        history: HistoryTypes.history
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        this._history = props.history.listen(this.handleHistory);
        this.handleHistory(props.history.location);
        this.setupLocationSync(this.valueManager);
    }

    componentWillReceiveProps({ history, valueManager }) {
        if (history !== this.props.history) {
            this._history && this._history();
            this._history = props.history.listen(this.handleHistory);
        }
        if (valueManager != this.props.valueManager) {
            this.setupLocationSync(this.valueManager);

        }
    }


    setupLocationSync(valueManager) {
        this._query && this._query();
        this._pathname && this._pathname();
        this._query    =
            valueManager.addListener('@query', this.syncQuery,
                this, false);
        this._pathname =
            valueManager.addListener('@pathname', this.syncPathname,
                this, false);
    }

    syncQuery(val) {
        //prevent race conditions, since history can update async.
        if (this._inhistory) {
            return;
        }
        this._insync = true;
        const search = qs.stringify(val).replace(/=(&)|(=$)|=true/g, '$1');
        this.valueManager.path('@pathname');
        this.props.history.push({
            pathname: this.valueManager.path('@pathname'),
            search  : search && `?${search}`
        });
        this._insync = false;
    }

    syncPathname(pathname) {
        //prevent race conditions, since history can update async.
        if (this._inhistory) {
            return;
        }
        this._insync = true;

        const val    = this.valueManager.path('@query');
        const search = qs.stringify(val).replace(/=(&)|(=$)|=true/g, '$1');
        this.props.history.push({
            pathname,
            search: search && `?${search}`
        });
        this._insync = false;

    }

    componentWillUnmount() {
        this._history && this._history();
        this._query && this._query();
        this._pathname && this._pathname();
    }

    handleHistory = ({ pathname = '', search = '' }) => {
        if (this._insync) {
            return
        }
        this._inhistory = true;
        const cur       = this.valueManager.path('@query');
        const kcur      = cur && Object.keys(cur) || [];
        const obj       = parse(search);
        const kobj      = obj && Object.keys(obj) || [];

        for (const key of kobj) {
            const idx = kcur.indexOf(key);
            if (idx > -1) {
                kcur.splice(idx, 1);
            }
            //an empty key is true.
            const val = obj[key] === '' || obj[key] == null || obj[key];

            this.valueManager.update(`@query.${key}`, val);
        }
        for (const key of kcur) {
            this.valueManager.update(`@query.${key}`);
        }
        this.valueManager.update('@pathname', pathname.replace(/^#/, ''));
        this._inhistory = false;
    };


    render() {
        const { history, ...rest } = this.props;
        return <Form {...rest}/>
    }
}
