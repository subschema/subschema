import List from './List';
import Mixed from './Mixed';
import ListItemTemplate from './ListItemTemplate';
import _styles from '../styles';
import CollectionCreateTemplate from './CollectionCreateTemplate';
import ContentItemTemplate from './ContentItemTemplate';
export const types = {
    List,
    Mixed
};
export const templates = {
    ListItemTemplate,
    CollectionCreateTemplate,
    ContentItemTemplate
};
export const styles = _styles;

export default ({types, templates, styles});