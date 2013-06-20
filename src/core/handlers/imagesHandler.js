var walk = require('../modules/walk');
var smushit = require('../modules/smushit/smushit');

var base = require('./base');

var imagesHandler = imagesHandler || {};

imagesHandler.unpackImages = function(rootPath, buildPath, imagesConfig) {
    imagesConfig.path.map(function(imagesPath) {
        (function(path) {
            var callFunc = arguments.callee;
            var self = this;
            var devPath = rootPath + path;
            if (devPath[devPath.length - 1] == '/') {
                var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                walker.on("file", function (root, fileStats, next) {
                    var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                    var filePathName = fileRootPathName.substr(rootPath.length);
                    callFunc.call(self, filePathName);
                    next();
                });
            } else {
                _doSmushit(devPath);
            }  
        })(imagesPath);
    });

    function _doSmushit(path) {
        var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
        if (suffix == "png" || suffix == "jpg") {
            smushit.smushit(path);
        }
    }
};

module.exports = imagesHandler;