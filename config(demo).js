var config = config || [{
    rootPath: '../example/',
    buildPath: '../example/production/',
    images: {
        path: ['img/']
    },
    js: {
        jsEnergy: ['js/'],
        copyOnly: ['js/systems/', 'js/doorlayer.js'],
        ignore: ['js/components/']
    },
    css: {
        cssEnergy: ['css/'],
        copyOnly: ['css/css1/', 'css/triangle1.css'],
        ignore: ['css/css2/']
    }
}];

module.exports = config;