var config = config || [{
    rootPath: '',
    buildPath: '',
    images: {
        imagesBuildPath: '',
        path: []
    },
    js: {
        jsBuildPath: '',
        jsDir: [],
        copyOnly: [],
        ignore: []
    },
    css: {
        cssBuildPath: '',
        cssDir: []
        copyOnly: [],
        ignore: []
    }
}];

module.exports = config;