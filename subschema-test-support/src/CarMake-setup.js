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
 * Create the schema programatically.
 */
schema.schema.make.options = Object.keys(CAR_MAKES_AND_MODELS).map(function (key) {
    fields.push(key);
    var {name, models} = CAR_MAKES_AND_MODELS[key];
    //setup the key values of them all.
    schema.schema[key] = {
        title: 'Model',
        conditional: {
            //This is the value to listen to trigger the conditional
            listen: 'make',
            //This is the value to compare the make's value to
            value: key,
            //Strict equals operator
            operator: '===',
            //We want the conditional to update the 'model' path.  This is a bit
            // experimental at the time, but may be the future of how to handle these
            // situations.
            path: 'model'
        },
        type: 'Select',
        placeholder:'Select a model of '+name,
        options: models
    }
    /**
     * Return the makes
     */
    return {
        label: name,
        val: key
    }
});
