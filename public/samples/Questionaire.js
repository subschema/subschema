module.exports = {
    description: 'Questionaire shows the used of the Mixed Type. \
     The mixed type is just like a List, however it can have non numeric keys.\
     The keys and the values are configurable. As of now however you can only have 1 key type and 1 object type\
     <p>* Press the Data button in the toolbar to see it with data</p>',
    schema: {
        schema: {
            questionare: {
                type: "Mixed",
                keyType: 'Text',
                title: 'Questioniare',
                labelKey: 'answer',
                canEdit: true,
                canDelete: true,
                canReorder: true,
                canAdd: true,
                valueType: {
                    type: 'Object',
                    subSchema: {
                        answer: 'Text',
                        feel: {
                            type: 'Radio',
                            options: ['Good', 'Bad', 'Indifferent']
                        }
                    }
                }
            }
        }
    },
    data: {
        questionare: {
            question1: {
                answer: 'I know nothing',
                feel: 'Good'
            },
            question2: {
                answer: 'I still know nothing',
                feel: 'bad'
            }
        }
    },
    errors: {
        'questionare.question2.answer': [{
            message: 'Are you sure?'
        }]
    }
}