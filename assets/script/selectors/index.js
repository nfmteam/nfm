import { createStructuredSelector } from 'reselect';

import counterSelector from './counter';
import messageSelector from './message';
import treeSelector from './tree';

export default createStructuredSelector({
    count: counterSelector,
    message: messageSelector,
    tree: treeSelector
});