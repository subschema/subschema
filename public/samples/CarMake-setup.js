module.exports = function (Subschema, node) {
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
    var schema = this.schema;
    /**
     * Assign the options.
     */
    schema.schema.make.options = Object.keys(CAR_MAKES_AND_MODELS).map(function (key) {
        return {
            label: CAR_MAKES_AND_MODELS[key].name,
            val: key
        }
    });
    /**
     * Use a valuemanager, this one is from the parent.
     * So sorry about the magic.   You can create ValueManager
     * var vm = Subschema.ValueManager();
     */
    node.vm.addListener('make', function (car) {
        var selected = car && CAR_MAKES_AND_MODELS[car];
        if (selected) {
            schema.schema.model.options = selected.models;
            schema.schema.model.placeholder = 'Please select a model of ' + selected.name;
        } else {
            schema.schema.model.placeholder = 'Select a make first';
            schema.schema.model.options = [];
        }
        //Change the state of the form and it will rerender.  Otherwise... it won't.
        this.setState({content: {schema}});
    }, node, true);



    //stuff
    return false;
}