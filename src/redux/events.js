import {UPDATE, UPDATED, ERROR, ERRORED, VALIDATE, SUBMIT, STATE} from './actions';

const event = (type, ...props)=>dispatcher=>(path, value, ...rest)=> dispatcher(props.reduce((ret, key, idx)=> {
    ret[key] = rest[idx];
    return ret;
}, {type, path, value}));

export const update = event(UPDATE);
export const updated = event(UPDATED, 'previousValue');
export const error = event(ERROR, 'messages');
export const errored = event(ERRORED, 'messages');
export const validate = event(VALIDATE);
export const state = event(STATE);
export const submit = event(SUBMIT, 'error', 'event');


export default ({
    update,
    validate,
    state,
    submit,
    error,
    errored
});