var fs  = require('./modules/fs'); 

var base = require('./core/base.js');
var imageHandler = require('./core/handlers/imagesHandler');
var jsHandler = require('./core/handlers/jsHandler');
var cssHandler = require('./core/handlers/cssHandler');

var config = require('../config');

function dipatcher(item) {
    for (var i in item) {
        switch(i) {
            case "images": {
                var imageConfig = item[i];
                base.createFloder(item.buildPath, function() {
                    imageHandler.unpackImages(item.rootPath, item.buildPath, imageConfig);
                });
                break ;
            }
            case "js": {
                var jsConfig = item[i];
                var jsFloderPath = item.buildPath + (jsConfig.jsBuildPath? jsConfig.jsBuildPath : '');
                base.createFloder(jsFloderPath, function() {
                    jsHandler.unpackJs(item.rootPath, jsFloderPath, jsConfig);
                });
                break ;
            }
            case "css": {
                var cssConfig = item[i];
                var cssFloderPath = item.buildPath + (cssConfig.cssBuildPath? cssConfig.cssBuildPath : '');
                base.createFloder(cssFloderPath, function() {
                    cssHandler.unpackCss(item.rootPath, cssFloderPath, cssConfig);
                });
                break;
            }
        }
    }
}


(function() {
    config.map(function(item) {
        fs.mkdir(item.buildPath);
        dipatcher(item);
    });
})();
