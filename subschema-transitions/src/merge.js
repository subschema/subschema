const ACTIONS = ['Enter', 'Leave', 'Appear'];
export default function merge(lessCtx, styleCtx) {
    return Object.keys(styleCtx).reduce(function (obj, nkey) {
        ACTIONS.reduce(function (obj, k) {
            const lkey = k.toLowerCase();
            const nobj = obj.transitionName || (obj.transitionName = {});
            if (lessCtx[`${nkey}${k}`]) {
                nobj[lkey] = lessCtx[`${nkey}${k}`];
                nobj[`${lkey}Active`] = lessCtx[`${nkey}${k}Active`];
            }
            return obj;
        }, obj[nkey] || (obj[nkey] = styleCtx[nkey])).transitionHeightClass = lessCtx[`${nkey}Height`];
        return obj;
    }, {});
}
