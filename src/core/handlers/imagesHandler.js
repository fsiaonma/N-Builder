var walk = require('../../modules/walk');
var smushit = require('../../modules/smushit/smushit');

var base = require('../base');

var imagesHandler = imagesHandler || {};

imagesHandler.unpackImages = function(rootPath, buildPath, imagesConfig) {
    var ignoreFilesPath = [];
    var copyFilesPath = [];
    var compressionFilesPath = [];

    var index = 0;
    var functions = [];

    imagesConfig.ignore? functions.push(_walkForIgnore) : '';
    imagesConfig.copyOnly? functions.push(_walkForCopy) : '';
    imagesConfig.compression? functions.push(_walkForCompression) : '';
    
    (functions[index])();

    function _nextStep() {
        return functions[++index];
    }

    function _walkForIgnore() {
        var ignoreWalking = 0;
        imagesConfig.ignore.map(function(ignoreFilePath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                var devPath = rootPath + path;
                if (devPath[devPath.length - 1] == '/') {
                    ++ignoreWalking;
                    var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name;
                        var filePathName = fileRootPathName.substr(rootPath.length);
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--ignoreWalking == 0) {
                            (_nextStep())();
                        }
                    });
                } else {
                    _doIgnore(devPath);
                    
                }
            })(ignoreFilePath);
        });
        if (ignoreWalking == 0) {
            (_nextStep())();
        }
    }

    function _doIgnore(devPath) {
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "png" || suffix == "jpg") {
            ignoreFilesPath.push(devPath);
        }
    }

    function _walkForCopy() {
        var copyWalking = 0;
        imagesConfig.copyOnly.map(function(copyFilePath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                var devPath = rootPath + path;
                if (devPath[devPath.length - 1] == '/') {
                    ++copyWalking;
                    var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name;
                        var filePathName = fileRootPathName.substr(rootPath.length);
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--copyWalking == 0) {
                            (_nextStep())();
                        }
                    });
                } else {
                    _doCopy(devPath, path);
                }
            })(copyFilePath);
        });
        if (copyWalking == 0) {
            (_nextStep())();
        }
    }

    function _doCopy(devPath, path) {
        for (var i = 0, len = ignoreFilesPath.length; i < len; ++i) {
            if (ignoreFilesPath[i] == devPath) {
                return ;
            }
        }
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "png" || suffix == "jpg") {
            copyFilesPath.push(devPath);
            var fileInPath = rootPath + path;
            var fileOutPath = buildPath + path;
            base.copyFile(fileInPath, fileOutPath);
        }
    }

    function _walkForCompression() {
        imagesConfig.compression.map(function(imagesPath) {
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
    }
    
    function _doSmushit(rootPath, buildPath, path) {
        var devPath = rootPath + path;
        for (var i = 0, len = copyFilesPath.length; i < len; ++i) {
            if (copyFilesPath[i] == devPath) {
                return ;
            }
        }
        for (var i = 0, len = ignoreFilesPath.length; i < len; ++i) {
            if (ignoreFilesPath[i] == devPath) {
                return ;
            }
        }
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "png" || suffix == "jpg") {
            var fileInPath = rootPath + path;
            var fileOutPath = buildPath + path;
            base.copyFile(fileInPath, fileOutPath, function() {
                smushit.smushit(fileOutPath);
            });
        }
    }
};

module.exports = imagesHandler;