const toNameValue = ([name, value]) => ({ name, value });
const isPair      = (arr) => {
    if (Array.isArray(arr) && arr.length == 2) {
        return !(Array.isArray(arr[0]) || Array.isArray(arr[1]));
    }

    return false;
};

const EMPTY_MAP = new Map();

const keys = Object.keys.bind(Object);

const contents$r = (ret, k) => {
    ret.push(...contents(k));
    return ret;
};

const contents = (key, value) => {
    //Do propTypes to resolvers name pairing.
    if (typeof key === 'object' && typeof value === 'object') {
        return keys(key).reduce((ret, k) => {
            if ((k in key) && (k in value)) {
                ret.push(...contents(key[k], value[k]),
                    ...contents(k, value[k]));
            }
            return ret;
        }, []);
    }
    if (value == null) {
        if (Array.isArray(key)) {
            if (isPair(key)) {
                return contents(key[0], key[1]);
            }
            return key.reduce(contents$r, []);
        }
        if (typeof key !== 'function') {
            return keys(key).reduce((ret, k) => {
                ret.push(...contents(k, key[k]));
                return ret;
            }, []);
        }
    }
    //This little bit of ugly, is to capture propTypes.isRequired and treat the
    // same.
    if (typeof key === 'function' && typeof key.isRequired === 'function') {
        return [[key, value], [key.isRequired, value]];
    }
    return [[key, value]];
};

const add = (key, value) => {

    if (key instanceof Map) {
        return key;
    }

    if (key == null) {
        return EMPTY_MAP;
    }
    return new Map(contents(key, value));
};

export default function (key, value) {
    const loaders = add(key, value);
    return {
        load(key) {
            return loaders.get(key);
        },

        list() {
            return Array.from(loaders.entries()).map(toNameValue)
        },
        remove(key) {
            loaders.delete(key);
            return this;
        }
    };
}
