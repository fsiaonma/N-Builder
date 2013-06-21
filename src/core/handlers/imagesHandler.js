var walk = require('../../modules/walk');
var smushit = require('../../modules/smushit/smushit');

var base = require('../base');

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
                _doSmushit(rootPath, buildPath, path);
            }  
        })(imagesPath);
    });

    function _doSmushit(rootPath, buildPath, path) {
        var devPath = rootPath + path;
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "png" || suffix == "jpg") {
            base.copyFile(rootPath, buildPath, path, function() {
                smushit.smushit(buildPath + path);
            });
        }
    }
};

module.exports = imagesHandler;