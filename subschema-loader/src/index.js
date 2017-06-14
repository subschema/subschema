import wrapLoader from './loader';
import warning from 'subschema-utils/lib/warning';

const upFirst = (str) => `${str[0].toUpperCase()}${str.substring(1)}`;

export const LOADER_TYPES = ['Resolver', 'Operator', 'Template',
    'Processor', 'Type', 'Schema', 'Validator',
    'Style', 'Transition'];

/**
 * Loaders allow for stacked resolution of Types, Template... and more.
 * It is how subschema gets things from string form to object form.
 */
class LoaderFactory {
    _loaders = new Set();

    /**
     * Sets up the types
     * @param type
     */
    loaderType(type) {
        const addType    = `add${type}`,
              listType   = `list${type}s`,
              removeType = `remove${type}`,
              loadType   = `load${type}`;

        /**
         * Add is a little different.  It creates a "fake loader", in
         * order to preserve order... Imagine if you will..
         *
         * EX*
         *
         * let l1 = loaderLoaderFactory([{type:{A:0}]);
         * l1.addType({A:1});
         * l1.addLoader({types:{A:2}})
         * l1.loadType('A') === 2;
         *
         * @type {(...p1:*[])}
         */
        this[addType] = this[`${addType}s`] = (...args) => {
            const wrapped = wrapLoader(...args);
            const load    = {
                [listType]  : wrapped.list,
                [loadType]  : wrapped.load,
                [removeType]: wrapped.remove
            };
            this._loaders.add(load);
            return load;
        };

        this[listType]   = () => {
            const all = [];
            this._loaders.forEach(function (loader) {
                if (typeof loader[listType] == 'function') {
                    all.push(...loader[listType]());
                }
            }, all);
            return Array.from(new Set(all));
        };
        this[removeType] = (val) => {
            this._loaders.forEach(function (loader) {
                if (typeof loader[removeType] == 'function') {
                    loader[removeType](val);
                }
            });
        };

        this[loadType] = (key) => {
            const arr = Array.from(this._loaders);
            for (let i = arr.length; i-- > 0;) {
                const l = arr[i];
                if (typeof l[loadType] === 'function') {
                    const c = l[loadType](key);
                    if (!(c === void(0))) {
                        return c;
                    }
                }
            }
        }
    }

    /**
     * An array of loaders and loader_types.
     * @param loaders
     * @param types
     */
    constructor(loaders = [], types = LOADER_TYPES) {
        warning(Array.isArray(loaders),
            `subschema-loader requires an array as first argument`);

        types.forEach(this.loaderType, this);
        this.addLoaders(...loaders);
    }

    /**
     * Adds a loader.   If a loader is passed, it is just passed on.
     * if an object is passed the keys are matched to the built in types
     * and added.
     *
     * @param loader
     * @returns {LoaderFactory}
     */
    addLoader = (loader) => {
        if (loader == null) {
            return this;
        }
        if (loader instanceof LoaderFactory) {
            this._loaders.add(loader);
            return loader;
        }
        Object.keys(loader).forEach(function (key) {
            const ukey = `add${upFirst(key)}`;
            this[ukey] && this[ukey](loader[key]);
        }, this);

        return this;
    };

    addLoaders   = (...loaders) => {
        [].concat(...loaders).forEach(this.addLoader, this);
        return this;
    };
    removeLoader = (loader) => {
        this._loaders.delete(loader);
        return this;
    };
}
class Warning extends LoaderFactory {
    constructor() {
        super();
        LOADER_TYPES.forEach(function (key) {
            this[`load${key}`] = function (type) {
                warning(false, 'unable to find "%s" named "%s', key, type);
            };

            this[`add${key}`] = this[`remove${key}`] = function () {
                warning(false, 'add or remove "%s" called on warning loader',
                    key);
            }
        }, this);
    }
}

export const WarningLoader = new Warning();

export default function factory(loaders) {
    return new LoaderFactory(loaders);
}
