var config = config || [{
    buildPath: './production/',
    images: {
        path: ['img/']
    },
    js: {
        jsEnergy: ['js/'],
        copyOnly: ['js/systems/'],
        ignore: ['js/components/']
    },
    css: {
        cssEnergy: [''],
        copyOnly: [''],
        ignore: ['']
    }
}];

module.exports = config;