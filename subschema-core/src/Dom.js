"use strict";

var EventListener = require('fbjs/lib/EventListener');
var ReactDOM = require('react-dom');

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
function isNodeInRoot(node, root) {
    node = ReactDOM.findDOMNode(node), root = ReactDOM.findDOMNode(root);
    return _isNodeInRoot(node, root);
}
function _isNodeInRoot(node, root){
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
}