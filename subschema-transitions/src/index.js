import styles from './transitions.js';
import less from './transitions.less';
import merge from './merge';

export const transitions = merge(less, styles);
export const mergeTransitions = merge;

export default ({
    transitions
});
