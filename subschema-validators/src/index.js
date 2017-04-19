//==================================================================================================
//VALIDATORS
//==================================================================================================
//Borrowed from backbone-forms, thanks!
function isFunction(val) {
    return typeof val === 'function';
}

export const errMessages = {
    required: 'Required',
    regexp: 'Invalid',
    number: 'Must be a number',
    email: 'Invalid email address',
    url: 'Invalid URL',
    match: function (field) {
        return 'Must match field "{}"'
    }
};

export const required = function (options) {
    options = {
        type: 'required',
        message: errMessages.required,
        ...options

    };

    return function required(value) {
        options = {...options, value};

        const err = {
            type: options.type,
            message: isFunction(options.message) ? options.message(options) : options.message
        };

        if (value === null || value === undefined || value === false || value === '') return err;
    };
};

export const regexp = function (options) {
    if (!options.regexp) throw new Error('Missing required "regexp" option for "regexp" validator');

    options = {
        type: 'regexp',
        match: true,
        message: errMessages.regexp,
        ...options
    };

    return function regexp(value) {
        options = {...options, value};

        const err = {
            type: options.type,
            message: isFunction(options.message) ? options.message(options) : options.message
        };

        //Don't check empty values (add a 'required' validator for validators)
        if (value === null || value === undefined || value === '') return;

        //Create RegExp from string if it's valid
        if ('string' === typeof options.regexp) options.regexp = new RegExp(options.regexp.replace(/^\/(.*)\/$/, '$1'), options.flags);

        if ((options.match) ? !options.regexp.test(value) : options.regexp.test(value)) return err;
    };
};

export const number = function (options) {
    options = {
        type: 'number',
        message: errMessages.number,
        regexp: /^[0-9]*\.?[0-9]*?$/,
        ...options
    };

    return regexp(options);
};

export const email = function (options) {
    options = {
        type: 'email',
        message: errMessages.email,
        regexp: /^[\w\-]{1,}([\w\-\+.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/,
        ...options
    };

    return regexp(options);
};

export const url = function (options) {
    options = {
        type: 'url',
        message: errMessages.url,
        regexp: /^(http|https):\/\/(([A-Z0-9][A-Z0-9_\-]*)(\.[A-Z0-9][A-Z0-9_\-]*)+)(:(\d+))?\/?/i
        , ...options
    };

    return regexp(options);
};

export const match = function (options) {
    if (!options.field) throw new Error('Missing required "field" options for "match" validator');

    options = {
        type: 'match',
        message: errMessages.match,
        ...options
    };

    return function match(value, attrs) {
        options = {...options, value};

        var err = {
            type: options.type,
            message: isFunction(options.message) ? options.message(options) : options.message
        };

        //Don't check empty values (add a 'required' validator for validators)
        if (value === null || value === undefined || value === '') return;

        if (value !== attrs.path(options.field)) return err;
    };
};
export default ({
    match, url, email, regexp, number, required
})