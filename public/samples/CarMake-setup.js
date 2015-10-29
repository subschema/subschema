/**
 * Borrowed from react-native docs.
 */
var CAR_MAKES_AND_MODELS = {
    amc: {
        name: 'AMC',
        models: ['AMX', 'Concord', 'Eagle', 'Gremlin', 'Matador', 'Pacer']
    },
    alfa: {
        name: 'Alfa-Romeo',
        models: ['159', '4C', 'Alfasud', 'Brera', 'GTV6', 'Giulia', 'MiTo', 'Spider']
    },
    aston: {
        name: 'Aston Martin',
        models: ['DB5', 'DB9', 'DBS', 'Rapide', 'Vanquish', 'Vantage']
    },
    audi: {
        name: 'Audi',
        models: ['90', '4000', '5000', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q5', 'Q7']
    },
    austin: {
        name: 'Austin',
        models: ['America', 'Maestro', 'Maxi', 'Mini', 'Montego', 'Princess']
    },
    borgward: {
        name: 'Borgward',
        models: ['Hansa', 'Isabella', 'P100']
    },
    buick: {
        name: 'Buick',
        models: ['Electra', 'LaCrosse', 'LeSabre', 'Park Avenue', 'Regal',
            'Roadmaster', 'Skylark']
    },
    cadillac: {
        name: 'Cadillac',
        models: ['Catera', 'Cimarron', 'Eldorado', 'Fleetwood', 'Sedan de Ville']
    },
    chevrolet: {
        name: 'Chevrolet',
        models: ['Astro', 'Aveo', 'Bel Air', 'Captiva', 'Cavalier', 'Chevelle',
            'Corvair', 'Corvette', 'Cruze', 'Nova', 'SS', 'Vega', 'Volt']
    }
};

var fields = schema.fieldsets[0].fields;
/**
 * Assign the options.
 */
schema.schema.make.options = Object.keys(CAR_MAKES_AND_MODELS).map(function (key) {
    fields.push(key);
    var current = CAR_MAKES_AND_MODELS[key];
    //setup the key values of them all.
    schema.schema[key] = {
        title: 'Models of '+current.name,
        conditional: {
            listen: 'make',
            value: key,
            operator: '==='
        },
        type: 'Select',
        options: current.models
    }
    /**
     * Return the makes
     */
    return {
        label: current.name,
        val: key
    }
});
