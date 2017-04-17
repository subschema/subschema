//==================================================================================================
//VALIDATORS
//==================================================================================================
//Borrowed from backbone-forms, thanks!

module.exports = (function (_) {

    var validators = {};

    validators.errMessages = {
        required: 'Required',
        regexp: 'Invalid',
        number: 'Must be a number',
        email: 'Invalid email address',
        url: 'Invalid URL',
        match: function(field){
            return 'Must match field "{}"'
        }
    };

    validators.required = function (options) {
        options = _.extend({
            type: 'required',
            message: validators.errMessages.required
        }, options);

        return function required(value) {
            options.value = value;

            var err = {
                type: options.type,
                message: _.isFunction(options.message) ? options.message(options) : options.message
            };

            if (value === null || value === undefined || value === false || value === '') return err;
        };
    };

    validators.regexp = function (options) {
        if (!options.regexp) throw new Error('Missing required "regexp" option for "regexp" validator');

        options = _.extend({
            type: 'regexp',
            match: true,
            message: validators.errMessages.regexp
        }, options);

        return function regexp(value) {
            options.value = value;

            var err = {
                type: options.type,
                message: _.isFunction(options.message) ? options.message(options) : options.message
            };

            //Don't check empty values (add a 'required' validator for validators)
            if (value === null || value === undefined || value === '') return;

            //Create RegExp from string if it's valid
            if ('string' === typeof options.regexp) options.regexp = new RegExp(options.regexp.replace(/^\/(.*)\/$/, '$1'), options.flags);

            if ((options.match) ? !options.regexp.test(value) : options.regexp.test(value)) return err;
        };
    };

    validators.number = function (options) {
        options = _.extend({
            type: 'number',
            message: validators.errMessages.number,
            regexp: /^[0-9]*\.?[0-9]*?$/
        }, options);

        return validators.regexp(options);
    };

    validators.email = function (options) {
        options = _.extend({
            type: 'email',
            message: validators.errMessages.email,
            regexp: /^[\w\-]{1,}([\w\-\+.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/
        }, options);

        return validators.regexp(options);
    };

    validators.url = function (options) {
        options = _.extend({
            type: 'url',
            message: validators.errMessages.url,
            regexp: /^(http|https):\/\/(([A-Z0-9][A-Z0-9_\-]*)(\.[A-Z0-9][A-Z0-9_\-]*)+)(:(\d+))?\/?/i
        }, options);

        return validators.regexp(options);
    };

    validators.match = function (options) {
        if (!options.field) throw new Error('Missing required "field" options for "match" validator');

        options = _.extend({
            type: 'match',
            message: validators.errMessages.match
        }, options);

        return function match(value, attrs) {
            options.value = value;

            var err = {
                type: options.type,
                message: _.isFunction(options.message) ? options.message(options) : options.message
            };

            //Don't check empty values (add a 'required' validator for validators)
            if (value === null || value === undefined || value === '') return;

            if (value !== attrs.path(options.field)) return err;
        };
    };


    return validators;

})(require('./tutils'));
