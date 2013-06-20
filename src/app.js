var fs  = require('./modules/fs'); 

var imageHandler = require('./core/handlers/imagesHandler');
var jsHandler = require('./core/handlers/jsHandler');
var cssHandler = require('./core/handlers/cssHandler');

var config = require('../config');

(function() {
    config.map(function(item) {
        fs.mkdir(item.buildPath);
        if (item.images) {
            imageHandler.unpackImages(item.rootPath, item.buildPath, item.images);
        } 
        if (item.js) {
        	fs.mkdir(item.buildPath + "javascripts");
            jsHandler.unpackJs(item.rootPath, item.buildPath + "javascripts/", item.js);
        }
        if (item.css) {
            fs.mkdir(item.buildPath + "css");
            cssHandler.unpackCss(item.rootPath, item.buildPath + "css/", item.css);
        }
    });
})();
