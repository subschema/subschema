import _List from './List';
import _Mixed from './Mixed';
import _ListItemTemplate from './ListItemTemplate';
import _styles from './styles';
import _CollectionCreateTemplate from './CollectionCreateTemplate';
import _ContentItemTemplate from './ContentItemTemplate';

export const CollectionCreateTemplate = _CollectionCreateTemplate;
export const ContentItemTemplate = _ContentItemTemplate;
export const List = _List;
export const Mixed = _Mixed;
export const ListItemTemplate = _ListItemTemplate;

export const types = {
    List,
    Mixed
};

export const templates = {
    ListItemTemplate: ListItemTemplate,
    CollectionCreateTemplate: CollectionCreateTemplate,
    ContentItemTemplate: ContentItemTemplate
};

export const styles = _styles;

export default ({types, templates, styles});
