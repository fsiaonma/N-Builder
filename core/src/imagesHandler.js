var walk = require('../modules/walk');
var smushit = require('../modules/smushit/smushit');

var base = require('./base');

var imagesHandler = function() {}

imagesHandler.unpackImages = function(buildPath, imagesConfig) {
    imagesConfig.path.map(function(imagesPath) {
        (function(path) {
            var callFunc = arguments.callee;
            var self = this;
            if (path[path.length - 1] == '/') {
                base.createFloder(buildPath, path);
                var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                walker.on("directories", function (root, dirStatsArray, next) {
                    dirStatsArray.map(function(item) {
                        base.createFloder(buildPath, root + '/' + item.name);
                    })
                    next();
                });
                walker.on("file", function (root, fileStats, next) {
                    var filePathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                    callFunc.call(self, filePathName);
                    next();
                });
            } else {
                var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                if (suffix == "png" || suffix == "jpg") {
                    smushit.smushit(path, {
                        onItemComplete: function(e, item, response) {
                            base.copyFile(item, buildPath);
                        },
                    });
                }
            }  
        })(imagesPath);
    });
}

module.exports = imagesHandler;