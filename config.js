var config = config || [{
    rootPath: '',
    buildPath: '',
    images: {
        imagesBuildPath: '',
        path: []
    },
    js: {
        jsBuildPath: '',
        jsEnergy: [],
        copyOnly: [],
        ignore: []
    },
    css: {
        cssBuildPath: '',
        cssEnergy: []
        copyOnly: [],
        ignore: []
    }
}];

module.exports = config;