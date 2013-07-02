var fs  = require('./modules/fs'); 

var base = require('./core/base.js');
var imageHandler = require('./core/handlers/imagesHandler');
var jsHandler = require('./core/handlers/jsHandler');
var cssHandler = require('./core/handlers/cssHandler');
var resourcesHandler = require('./core/handlers/resourcesHandler');

var config = require('../config');

function dipatcher(item) {
    for (var i in item) {
        switch(i) {
            case "images": {
                var imageConfig = item[i];
                imageHandler.unpackImages(item.rootPath, item.buildPath, imageConfig);
                break ;
            }
            case "js": {
                var jsConfig = item[i];
                jsHandler.unpackJs(item.rootPath, item.buildPath, jsConfig);
                break ;
            }
            case "css": {
                var cssConfig = item[i];
                cssHandler.unpackCss(item.rootPath, item.buildPath, cssConfig);
                break ;
            }
            case "resources": {
                var resourcesConfig = item[i];
                resourcesHandler.unpackResources(item.rootPath, item.buildPath, resourcesConfig);
                break ;
            }
        }
    }
}

(function() {
    config.map(function(item) {
        fs.mkdir(item.buildPath, 10, function() {
            dipatcher(item);
        });
    });
})();
