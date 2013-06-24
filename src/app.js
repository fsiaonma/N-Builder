var fs  = require('./modules/fs'); 

var base = require('./core/base.js');
var imageHandler = require('./core/handlers/imagesHandler');
var jsHandler = require('./core/handlers/jsHandler');
var cssHandler = require('./core/handlers/cssHandler');

var config = require('../config');

(function() {
    config.map(function(item) {
        fs.mkdir(item.buildPath);
        if (item.images) {
            var imagesFloderPath = item.buildPath + (item.images.imagesBuildPath? item.images.imagesBuildPath : '');
            base.createFloder(imagesFloderPath, function() {
                imageHandler.unpackImages(item.rootPath, imagesFloderPath, item.images);
            });
        } 
        if (item.js) {
            var jsFloderPath = item.buildPath + (item.js.jsBuildPath? item.js.jsBuildPath : '');
            base.createFloder(jsFloderPath, function() {
                jsHandler.unpackJs(item.rootPath, jsFloderPath, item.js);
            });
        }
        if (item.css) {
            var cssFloderPath = item.buildPath + (item.css.cssBuildPath? item.css.cssBuildPath : '');
            base.createFloder(cssFloderPath, function() {
                cssHandler.unpackCss(item.rootPath, cssFloderPath, item.css);
            });
        }
    });
})();
