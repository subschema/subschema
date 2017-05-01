module.exports = {
    description: 'A super simple <b>Todo List</b> because every body\'s gotta.   This one shows how the List type works.   List editing can be turned on or off, by default its off ',
    schema: {
        "schema": {
            "tasks": {
                type: "List",
                title: 'Task',
                canAdd: true,
                canDelete: true,
                canReorder: true,
                canEdit: true,
                inline:true,
                addButton:{
                    "label": "Add Task",
                    "className": "btn btn-default btn-add"
                }
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
