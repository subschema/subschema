module.exports = {
    description: 'Super basic form, with select and a requied name',
    schema: {
        "schema": {
            "mm/yy": {"type": "Restricted", formatter: "shortDate", title: "MM/YY"},
            "ccard": {
                "type": "Restricted",
                "formatter": "creditcard"
            },
            "capitalize": {
                "type": "Restricted",
                "formatter": "capitalize"
            },
            "title": {
                "type": "Restricted",
                "formatter": "title"
            },
            "uszip": {
                "title": "US Zip",
                "type": "Restricted",
                "formatter": "uszip"

            },
            '###': {
                "title": "Pattern",
                "type": "Restricted",
                "formatter": "###"
            },
            "unrestricted": {
                "title": "Plain",
                "type": "Text"
            },
            'usphone': {
                "title": "US Phone",
                "type": "Restricted",
                "formatter": "1 (###) ###-####"
            }/*,
             'dollars':{
             "title":"US Dollars",
             "type":"Restricted",
             "formatter":"00.00"
             }
             */
        },
        "fieldsets": [{
            "legend": "Restricted values",
            "fields": ["unrestricted", "title","capitalize", "mm/yy", "ccard", "uszip", "###", 'usphone']
        }]
    },
    data: {
        "mm/yy": '02/22',
        "ccard": '4111 1111 1111 1111',
        "usphone":"1 (555) 123-4567",
        "capitalize":"Hello world",
        "title":"Hello World",
        "###":"123",
        "uszip":"22202"
    },
    errors: {
        ccard: [{
            message: 'Invalid Card #'
        }]
    }

};
