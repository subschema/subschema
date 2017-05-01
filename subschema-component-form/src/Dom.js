"use strict";
import _EventListener from 'fbjs/lib/EventListener';
import ReactDOM from 'react-dom';

export const EventListener = _EventListener;
/**
 * listen
 */
export function listen(node, event, func) {
    return EventListener.listen(ownerDocument(node), event, func);
}
/**
 * Get elements owner document
 *
 * @param {ReactComponent|HTMLElement} componentOrElement
 * @returns {HTMLElement}
 */
export function ownerDocument(componentOrElement) {
    var elem = ReactDOM.findDOMNode(componentOrElement);
    return elem && elem.ownerDocument || document;
}
/**
 * Checks whether a node is within
 * a root nodes tree
 *
 * @param {DOMElement} node
 * @param {DOMElement} root
 * @returns {boolean}
 */
export function isNodeInRoot(node, root) {
    node = ReactDOM.findDOMNode(node), root = ReactDOM.findDOMNode(root);
    return _isNodeInRoot(node, root);
}
function _isNodeInRoot(node, root) {
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
}

export default ({
    listen,
    ownerDocument,
    isNodeInRoot
});