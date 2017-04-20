const ACTIONS = ['Enter', 'Leave', 'Appear'];
export default function merge(less, defaults) {
    return Object.keys(less).reduce(function (obj, nkey) {
            const cobj = obj[nkey];
            const Style = less[nkey];
            if (cobj) {
                Object.keys(cobj).forEach(function (skey) {
                    ACTIONS.reduce(function (obj, k) {
                        const lkey = k.toLowerCase();
                        const nobj = obj.transitionName || (obj.transitionName = {});
                        if (Style[`${skey}${k}`]) {
                            nobj[lkey] = Style[`${skey}${k}`];
                            nobj[`${lkey}Active`] = Style[`${skey}${k}Active`];
                        }
                        return obj;
                    }, cobj[skey])[`transitionHeightClass`] = Style[`${skey}Height`]
                });
            } else {
                obj[nkey] = Style;
            }
            return obj;
        },
        //First find the style.js.
        Object.keys(defaults).reduce(function (obj, key) {
            obj[key] = defaults[key];
            return obj;
        }, {}));
}