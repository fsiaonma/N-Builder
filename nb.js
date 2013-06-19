var fs  = require('./core/modules/fs'); 

var jsHandler = require('./core/src/jsHandler');
var imageHandler = require('./core/src/imagesHandler');

var config = require('./config');

(function() {
    config.map(function(item) {
        fs.mkdir(item.buildPath);
        if (item.images) {
            imageHandler.unpackImages(item.buildPath, item.images);
        } 
        if (item.js) {
        	fs.mkdir(item.buildPath + "javascripts");
            jsHandler.unpackJs(item.buildPath + "javascripts/", item.js);
        }
    });
})();
