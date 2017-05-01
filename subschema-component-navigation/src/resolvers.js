import {history as historyPropType} from './PropTypes';
import qs from 'querystring';
import get from 'lodash/get';

export function handleListeners(value, key, props, {history}) {
    this.state[key] = history.location;
    return history.listen((location) => {
        this.setState({[key]: location})
    });
}

export function location(Clazz, key) {
    Clazz.contextTypes.history = historyPropType;

    this.listener.call(Clazz, key, handleListeners);
}
function parse(search = '') {
    return qs.parse(search.replace(/^\?+?/, ''));
}
function queryVal(location, path) {
    const val = parse(location.search);
    if (path)
        return get(val, path);
    return val;
}
export function queryListeners(value, key, props, {history}) {
    this.state[key] = queryVal(history.location, value);
    return history.listen((location) => {
        this.setState({[key]: queryVal(location, value)})
    });
}
export function query(Clazz, key) {
    Clazz.contextTypes.history = historyPropType;
    this.listener.call(Clazz, key, queryListeners);
}
export function queryExistsListeners(value, key, props, {history}) {
    value = value || key;
    const val = parse(history.location.search);
    this.state[key] = value ? val.hasOwnProperty(value) : Object.keys(val) > 0;
    return history.listen((location) => {
        const val = parse(location.search);
        this.setState({[key]: value ? val.hasOwnProperty(value) : Object.keys(val) > 0})
    });
}
export function queryExists(Clazz, key) {
    Clazz.contextTypes.history = historyPropType;
    this.listener.call(Clazz, key, queryExistsListeners);
}

export const resolvers = {
    location,
    query,
    queryExists
};

export default resolvers;