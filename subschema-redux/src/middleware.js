import {UPDATE, ERROR, STATE, VALIDATE, SUBMIT} from './actions';
import _castPath from 'lodash/_castPath';
import {updated, errored} from './events';
import _get from 'lodash/get';
import each from 'lodash/each';
import keys from 'lodash/keys';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
const canDescend = (value)=>(value == null) ? false : isPlainObject(value) || isArray(value);

const combinedKeys = (obj, ...rest)=> {
    const ret = canDescend(obj) ? keys(obj) : [];

    for (const o of rest) {
        if (canDescend(o)) {

            for (const ok of  keys(o)) {
                if (ret.indexOf(ok) == -1) {
                    ret.push(ok);
                }
            }
        }
    }
    return ret.length == 0 ? null : ret;
};

const descend = (listen, v, ov, ...paths)=> {
    const uniq = combinedKeys(v, ov);
    if (uniq) {
        each(uniq, k => {
            const ak = [k];
            descend(listen, _get(v, ak), _get(ov, ak), ...paths, k)
        });
    } else {
        listen(paths);
    }
};

export default ({value, error, state, validate, submit, getValue, getError, getState})=>store=>next=> (action)=> {
    const {type, path, ...rest} = action;
    switch (type) {
        case UPDATE: {

            const oldValue = getValue();
            next(action);
            const curValue = getValue();

            if (path == null) {
                descend(paths=>value(curValue, oldValue, paths), curValue, oldValue);
                return updated(next)(curValue, oldValue);
            } else {
                const casted = _castPath(path);
                const nVal = _get(curValue, casted);
                value(curValue, oldValue, casted);
                return updated(next)(nVal, _get(oldValue, casted));
            }

            break;
        }
        case ERROR: {
            const oldValue = getError();
            next(action);
            const curValue = getError();
            error(curValue, oldValue, path);
            if (path == null) {
                return errored(next)(curValue, oldValue, path);
            }
            return errored(next)(curValue[path], oldValue[path], path);
            break;
        }
        case STATE: {
            const oldValue = getState();
            next(action);
            const curValue = getState();

            if (path == null) {
                descend(paths=>value(curValue, oldValue, paths), curValue, oldValue);
                return updated(next)(curValue, oldValue);
            } else {
                const casted = _castPath(path);
                const nVal = _get(curValue, casted);
                state(curValue, oldValue, casted);
                return updated(next)(nVal, _get(oldValue, casted));
            }
            break;
        }
        case SUBMIT: {
            submit(getValue(), getError(), rest.event, path);
            break;
        }
        case VALIDATE: {
            validate(getValue(), path);

            break;
        }


    }
    return next(action);

};