module.exports = {
    loadValidator(validator){
        var validators = require('./validators');
        return validators[validator] && validators[validator].bind(validators);
    },
    listValidators(){
        var validators = require('./validators');
        return Object.keys(validators).map(function (name) {
            var validator = validators[name];
            return {
                name, validator
            };
        });
    }
}