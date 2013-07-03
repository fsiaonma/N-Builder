var fs = require('../../modules/fs');
var walk = require('../../modules/walk');

var base = require('../base');

var resourcesHandler = resourcesHandler || {};

resourcesHandler.unpackResources = function(rootPath, buildPath, resourcesConfig) {
	var ignoreFilesPath = [];
    var copyFilesPath = [];

    var index = 0;
    var functions = [];

    resourcesConfig.ignore? functions.push(_walkForIgnore) : '';
    resourcesConfig.copyOnly? functions.push(_walkForCopy) : '';
    
    (functions[index])();

    function _nextStep() {
        return functions[++index];
    }

    function _walkForIgnore() {
        var ignoreWalking = 0;
        resourcesConfig.ignore.map(function(ignoreFilePath) {
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
    	if (suffix != "js" && suffix != "css" && suffix != "png" && suffix != "jpg" && suffix != "html") {
    		ignoreFilesPath.push(devPath);
    	}
    }

    function _walkForCopy() {
        resourcesConfig.copyOnly.map(function(copyFilePath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                var devPath = rootPath + path;
                if (devPath[devPath.length - 1] == '/') {
                    var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name;
                        var filePathName = fileRootPathName.substr(rootPath.length);
                        callFunc.call(self, filePathName);
                        next();
                    });
                } else {
                    _doCopy(devPath, path);
                }
            })(copyFilePath);
        });
    }

    function _doCopy(devPath, path) {
        for (var i = 0, len = ignoreFilesPath.length; i < len; ++i) {
            if (ignoreFilesPath[i] == devPath) {
                return ;
            }
        }
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix != "js" && suffix != "css" && suffix != "png" && suffix != "jpg" && suffix != "html") {
            copyFilesPath.push(devPath);
            var fileInPath = rootPath + path;
            var fileOutPath = buildPath + path;
            base.copyFile(fileInPath, fileOutPath);
        }
    }
};

module.exports = resourcesHandler;