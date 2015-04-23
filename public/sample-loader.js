/**
 * This loader helps with the samples
 * @param setupTxt
 * @returns {*}
 */
module.exports = function (setupTxt) {
    this.cacheable && this.cacheable();
    setupTxt = handle(setupTxt);
    this.value = setupTxt;
    return setupTxt;

};

function handle(setupTxt) {
    var setup = setupTxt.split('\n');

    //delete until you get past the export line
    while (!/module\.exports/.test(setup.shift()));

    //remove first level indent
    setup = setup.map(function (v) {
        return v.replace(/^    /, '');
    });

    //remove the lines until it returns.
    while (!/return/.test(setup.pop()));

    return setup.join('\n');
}