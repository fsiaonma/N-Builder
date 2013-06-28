var config = config || [{
    rootPath: '',
    buildPath: '',
    images: {
        path: []
    },
    js: {
        jsBuildPath: '',
        compression: [{
            dir: [],
            outputFileName: ''
        }],
        copyOnly: [],
        ignore: []
    },
    css: {
        cssBuildPath: '',
        compression: [{
            dir: [],
            outputFileName: ''
        }],
        copyOnly: [],
        ignore: []
    }
}];

module.exports = config;