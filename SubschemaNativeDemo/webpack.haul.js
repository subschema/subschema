module.exports = function (obj) {
    console.log(`Haul obj`, JSON.stringify(obj, null, 2));
    return {
        entry: `./index.${obj.platform}.js`
    }
};