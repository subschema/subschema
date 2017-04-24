import createHistory from 'history/createHashHistory';
const history = createHistory({
    hashType: 'slash' // Google's legacy AJAX URL format

});
export default history;
