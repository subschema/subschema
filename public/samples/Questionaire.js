module.exports = {
    schema: {
        schema: {
            questionare: {
                type: "Mixed",
                keyType: 'Text',
                title: 'Questioniare',
                labelKey:'answer',
                canEdit:true,
                canDelete:true,
                canReorder:true,
                canAdd:true,
                valueType: {
                    type:'Object',
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