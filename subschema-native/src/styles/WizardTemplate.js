import {Dimensions} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

export default({
    container: {
        flex: 1,
        marginTop: 30,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    tabView: {
        overflow: 'hidden',
        width: deviceWidth,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        marginTop: -10,
        padding: 15,
    },
});