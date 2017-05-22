export default ({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginTop: 20
    },
    header: {
        padding: 10
    },
    innerContainer: {
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        borderColor: '#9da3a6',
        borderWidth: 1,
    },
    body: {
        /*alignItems: 'center',
         flexDirection: 'column',
         justifyContent: 'center',
         flex: 1,
         borderColor: 'red',
         borderWidth:1*/
    },
    row: {
        alignItems: 'center',
        //  flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
//        flex: 1,
        flexDirection: 'row',
        fontWeight: 'bold',
    },
    buttons: {
        /*  flexDirection: 'row',
         justifyContent: 'space-between',
         flexWrap: 'nowrap',
         borderWidth: 1,
         borderColor: 'red',*/
    },
    backdrop: {
        paddingTop: 20
    },
    backBtn: {
        alignSelf: 'flex-start'
    },
    button: {
        borderRadius: 5,
        flex: 1,
        height: 44,
        alignSelf: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center',
    },
    modalButton: {
        marginTop: 10,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        /*        position: 'absolute',
         bottom: 0,
         left: 0,
         right: 0,
         top: 0*/
    },
    innerContainerTransparentStyle: {
        backgroundColor: '#fff',
        padding: 20
    }
});