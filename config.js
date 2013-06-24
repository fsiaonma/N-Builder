var config = config || [{
    rootPath: '',
    buildPath: '',
    images: {
        buildPath: '',
        path: []
    },
    js: {
        buildPath: '',
        jsEnergy: [],
        copyOnly: [],
        ignore: []
    },
    css: {
        buildPath: '',
        cssEnergy: []
        copyOnly: [],
        ignore: []
    }
}];

module.exports = config;