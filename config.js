var config = config || {
    unpackProjects: []
};

config.projects = [{
    projectName: '',
    rootPath: '',
    buildPath: '',
    resources: {
        copyOnly: [],
        ignore: []
    },
    images: {
        compression: [],
        copyOnly: [],
        ignore: []
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