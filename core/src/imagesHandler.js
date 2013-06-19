var walk = require('../modules/walk');
var smushit = require('../modules/smushit/smushit');

var base = require('./base');

var imagesHandler = imagesHandler || {};

imagesHandler.unpackImages = function(buildPath, imagesConfig) {
    imagesConfig.path.map(function(imagesPath) {
        (function(path) {
            var callFunc = arguments.callee;
            var self = this;
            if (path[path.length - 1] == '/') {
                var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                walker.on("file", function (root, fileStats, next) {
                    var filePathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                    callFunc.call(self, filePathName);
                    next();
                });
            } else {
                var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                if (suffix == "png" || suffix == "jpg") {
                    smushit.smushit(path);
                }
            }  
        })(imagesPath);
    });
}

module.exports = imagesHandler;