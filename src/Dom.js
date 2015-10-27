var EventListener = require('fbjs/lib/EventListener');
var React = require('./react');
module.exports = {
    EventListener,
    ownerDocument,
    isNodeInRoot,
    listen

}
/**
 * listen
 */
function listen(node, event, func) {
    return EventListener.listen(ownerDocument(node), event, func);
}
/**
 * Get elements owner document
 *
 * @param {ReactComponent|HTMLElement} componentOrElement
 * @returns {HTMLElement}
 */
function ownerDocument(componentOrElement) {
    var elem = React.findDOMNode(componentOrElement);
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
function isNodeInRoot(node, root) {
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
}
