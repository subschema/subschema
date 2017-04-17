import {combineReducers} from 'redux';
import {ERROR, UPDATE, STATE} from './actions';
import _set from 'lodash/set';
import _get from 'lodash/get';
import clone from 'lodash/clone';
import isInt from 'lodash/isInteger';
import isPlainObject from 'lodash/isPlainObject';
import isArrayLike from 'lodash/isArrayLike';

import castPath from 'lodash/_castPath'

const error = (state = {}, {type, value, path, ...rest})=> {
    if (type !== ERROR) return state;
    if (path == null) {
        return value == null ? {} : value;
    }

    if (state[path] === value) return state;

    const cval = value;
    const ret = {...state, [path]: value};
    if (cval == null) {
        delete ret[path];
    }
    return ret;
};

const cloneCopyOrCreate = (obj, path)=> {
    const val = _get(obj, path);
    if (isPlainObject(val) || isArrayLike(val)) {
        return clone(val);
    }
    return isInt(path[path.length - 1]) ? [] : {};
};

const valueMaker = (eventType)=>(state = {}, {type, value, path})=> {
    if (type !== eventType) return state;
    if (path == null) {
        return value == null ? {} : {...value};
    }
    //this may be cached...careful.
    const paths = castPath(path);
    const currentValue = _get(state, paths);
    if (currentValue === value) {
        return state;
    }
    state = {...state};

    if (paths.length === 1) {
        _set(state, paths, value);
    } else {
        //copy so shallow compare works.
        state = {...state};
        const lastIndex = paths.length - 1;
        const topath = paths.slice(0, lastIndex);
        //clone so that object at depth works works.
        const copyStateAtPath = cloneCopyOrCreate(state, topath);
        _set(copyStateAtPath, paths.slice(lastIndex), value);
        _set(state, topath, copyStateAtPath);
    }
    return state;
};

export default combineReducers({
    error,
    value: valueMaker(UPDATE),
    state: valueMaker(STATE)
});