var fs  = require('./modules/fs'); 

var imageHandler = require('./core/handlers/imagesHandler');
var jsHandler = require('./core/handlers/jsHandler');
var cssHandler = require('./core/handlers/cssHandler');

var config = require('../config');

(function() {
    config.map(function(item) {
        fs.mkdir(item.buildPath);
        if (item.images) {
            var buildPath = item.buildPath + (item.images.buildPath? item.images.buildPath : '');
            imageHandler.unpackImages(item.rootPath, buildPath, item.images);
        } 
        if (item.js) {
            var buildPath = item.buildPath + (item.js.buildPath? item.js.buildPath : '');
            jsHandler.unpackJs(item.rootPath, buildPath, item.js);
        }
        if (item.css) {
            var buildPath = item.buildPath + (item.css.buildPath? item.css.buildPath : '');
            cssHandler.unpackCss(item.rootPath, buildPath, item.css);
        }
    });
})();
