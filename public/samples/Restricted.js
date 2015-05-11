module.exports = {
    description: 'Super basic form, with select and a requied name',
    schema: {
        "schema": {
            "mm/yy": {"type": "Restricted", formatter: "shortDate", title: "MM/YY"},
            "ccard": {
                "type": "Restricted",
                "formatter": "creditcard"
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
            }


        },
        "fieldsets": [{"legend": "Restricted values", "fields": ["mm/yy", "ccard", "uszip", "###"]}]
    },
    data: {
        "mm/yy": '02/22',
        "ccard": '1234 4567 8901 2345',
        "formatter": "033"
    },
    errors: {
        ccard: [{
            message: 'Invalid Card #'
        }]
    }

};
