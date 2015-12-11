import {  useQueries,useBasename } from 'history'
import createHistory from 'history/lib/createHashHistory'
const history = useQueries(useBasename(createHistory))({
    basename:'#'
});
export default history;
