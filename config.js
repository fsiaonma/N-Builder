var config = config || [{
    rootPath: '',
    buildPath: '',
    resources: {
        copyOnly: [],
        ignore: []
    },
    images: {
        path: []
    },
    js: {
        compression: [{
            dir: [],
            outputFile: ''
        }],
        copyOnly: [],
        ignore: []
    },
    css: {
        compression: [{
            dir: [],
            outputFile: ''
        }],
        copyOnly: [],
        ignore: []
    }
}];

module.exports = config;