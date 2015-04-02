module.exports = {
    schema: {
        "schema": {
            "tasks": {
                type: "List",
                title: 'Task',
                canAdd: true,
                canDelete: true,
                canReorder: true,
                canEdit: true
            }
        },
        "fieldsets": [{
            "legend": "Todo",
            "fields": ["tasks"]
        }]
    },
    data: {
        tasks: ['Get Stuff', 'Do Stuff', 'Go Home']
    },
    errors: {
        'todos.1': [{
            message: 'No your not going to'
        }]
    }
}
;
