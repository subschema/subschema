export default ({
    pullTab: {
        backgroundColor: 'red',
        width: 10,
    },
    container: {
        position: 'absolute',

    },
    wrapper: {
        height: 50,
        position: 'relative',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    button: {
        /*       flexGrow:1,
         flexShrink:1,
         flexBasis:0
         */
    },
    ctrlButtons: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notAnimated: {
        position: 'absolute',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5,
        margin: 0,
        backgroundColor: 'blue'
    }
})