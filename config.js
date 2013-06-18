var config = config || [{
    buildPath: './gogo',
    images: {
        path: ['./img/']
    },
    js: {
        jsEnergy: ['./js/'],
        copyOnly: ['./js/'],
        ignore: ['./js/systems/']
    },
    css: {
        compression: [''],
        copyOnly: [''],
        ignore: ['']
    }
}];

module.exports = config;