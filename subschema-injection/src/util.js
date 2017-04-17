"use strict";


function applyNice(f1, f2) {
    if (f1 === f2 || !f2) return f1;
    if (!f1) return f2;
    return function applyNice$return(...args) {
        this::f1(...args);
        this::f2(...args);
    };
}

function extendPrototype(property, fn) {
    this.prototype[property] = applyNice(fn, this.prototype[property]);
    return this;
}

function execArg(v) {
    v && v();
}

const push = Function.apply.bind(Array.prototype.push);

function keyIn(key, ...args) {
    for (let arg of args) {
        if (arg == null) continue;
        if (key in arg)
            return arg[key];
    }
    return;
}
function onlyKeys(keys, ...args) {
    const ret = {};
    for (let key of keys) {
        for (let arg of args) {
            if (arg == null) continue;
            if (key in arg) {
                ret[key] = arg[key];
                break;
            }
        }
    }
    return ret;
}

function uniqueKeys(...args) {
    const keys = [];
    for (let arg of args) {
        if (arg == null) continue;
        for (let key of Object.keys(arg)) {
            if (keys.indexOf(key) === -1) {
                keys.push(key);
            }
        }
    }
    return keys;
}

function extend(name, fn) {
    const fn2 = this.prototype[name];
    this.prototype[name] = applyNice(fn, fn2);
}
function didMount() {
    this.mounted = true;
}

function listener(key, fn) {
    function listener$listen(props, context) {
        if (!this.injected) {
            this.injected = {};
        }
        if (!this._listeners) {
            this._listeners = {};
        } else if (this._listeners[key]) {
            this._listeners[key]();
        }
        this._listeners[key] = this::fn(props[key], key, props, context);
    }

    this::extend('componentDidMount', didMount);

    this::extend('componentWillMount', function listener$willMount() {
        this.mounted = false;
        this::listener$listen(this.props, this.context);
    });

    this::extend('componentWillReceiveProps', listener$listen);

    this::unmount(function () {
        this.mounted = false;
        this._listeners && this._listeners[key] && this._listeners[key]();
    });

}
function prop(key, fn) {
    //this is class scope.
    this::extend('componentWillMount', function util$prop$willMount() {
        //this is instance scope.
        if (!this.injected) this.injected = {};
        this.injected[key] = this::fn(this.props[key], key, this.props, this.context);
    });

    this::extend('componentWillReceiveProps', function util$prop$receiveProps(props, context) {
        if (!this.injected) this.injected = {};
        if (props[key] !== this.props[key]) {
            this.injected[key] = this::fn(props[key], key, props, context);
        }
    });

    return this;
}
function extendStatic(name, value) {
    this[name] = value;
}
function removeListeners(listeners) {
    if (listeners) {
        listeners.forEach(execArg);
        listeners.length = 0;
    }
    return listeners;
}
function clearListeners() {
    if (this.listeners) {
        return removeListeners(this.listeners);
    }
}
function unmount(fn) {
    this.prototype.componentWillUnmount = applyNice(fn, this.prototype.componentWillUnmount);
}

export  {
    applyNice,
    listener,
    extend,
    prop,
    unmount,
    extendStatic,
    extendPrototype,
    onlyKeys,
    keyIn,
    uniqueKeys,
    execArg,
    push,
    removeListeners,
    clearListeners
}