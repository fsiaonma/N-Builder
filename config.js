var config = config || [{
    rootPath: '',
    buildPath: '',
    images: {
        imagesBuildPath: '',
        path: []
    },
    js: {
        jsBuildPath: '',
        jsRoot: [],
        copyOnly: [],
        ignore: []
    },
    css: {
        cssBuildPath: '',
        cssRoot: []
        copyOnly: [],
        ignore: []
    }
}];

module.exports = config;