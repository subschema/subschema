module.exports = {
    description: 'Shows how you can use Expressions on Custom Types',
    schema: {
        schema:{
            selectPage:{
                type:'Select',
                options:'Content, Conditional, Basic, Autocomplete'
            },
            link1:{
                type:'Anchor',
                label:'Go To {..selectPage}',
                href:'/#/{..selectPage}'
            }
        },
        fields:"selectPage, link1"
    },
    data: {
        selectPage: 'Content'
    },
    setupTxt: require('!!raw!./Expression-setup.js')
}
