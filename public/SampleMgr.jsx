var samples = require.context('./samples/', true, /\.js(x)?$/).keys().filter(function (v) {
    return !/-setup\.js(x)?/.test(v);
}).map((v)=> {
    var file = v.replace('./', '');
    return {
        name: v.replace(/\.\/(.*)\.js(x)?/, '$1'),
        file
    };
}), ValueManager = require('../src/ValueManager');
function SampleMgr(data) {
    var vm = new ValueManager();
    this.lookupSample = function (name) {
        for (var i = 0, l = data.length; i < l; i++) {
            if (data[i].name === name) {
                return data[i];
            }
        }
    }
    this.getAll = function () {
        return samples;
    }
    this.valueManager = function () {
        return vm;
    }
}
module.exports = new SampleMgr(samples);