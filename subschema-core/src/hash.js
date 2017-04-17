"use strict";
function hash(string) {
    string = string == null ? '' : string + '';
    let hash = 0;
    if (!string) return '' + hash;
    const length = string.length;
    for (let i = 0; i < length; i++) {
        hash = ((hash << 5) - hash) + string.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return (hash).toString(16);
}
export class HashBuilder {
    hash = 0;

    constructor(str) {
        this.add(str);
    }

    addValue(val) {
        if (val == null) {
            return this;
        }
        const tval = typeof val;
        if (tval === 'string') {
            return this.add(val);
        }
        if (tval === 'number') {
            this.hash += val;
            return this;
        }
        if (tval === 'boolean') {
            return this.add('' + val);
        }

        if (tval === 'function') {
            return this.addFunction(val);
        }

        return this.addObject(val);
    }

    addObject(obj) {
        this.addChar('=');
        if (obj != null) {
            const keys = Object.keys(obj);
            for (let i = 0, l = keys.length; i < l; i++) {
                const key = keys[i];
                this.addKey(key).addValue(obj[key]);
            }
        }
        return this;
    }

    addKey(key) {
        return this.addChar(',').add(key).addChar(':');
    }

    addFunction(func) {
        this.hash += parseInt(hashFunc(func), 16);
        return this;
    }

    addChar(val) {
        let hash = this.hash;
        hash = ((hash << 5) - hash) + val.charCodeAt(0);
        this.hash = hash & hash; // Convert to 32bit integer
        return this;
    }

    add(str) {
        str = str == null ? '' : str + '';
        let hash = this.hash;
        for (let i = 0, l = str.length; i < l; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        this.hash = hash;
        return this;
    }

    toString() {
        return (this.hash).toString(16);
    }
}
export function hashFunc(func) {
    return func == null ? 0 : func.$hash || (func.$hash = hash(func.toString()));
}

export default  hash;