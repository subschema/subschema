import createHistory from 'history/createHashHistory';
const history = createHistory({
    basename:'#'
});
export default history;
