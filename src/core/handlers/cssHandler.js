var fs = require('../../modules/fs');
var walk = require('../../modules/walk');
var cleanCSS = require('../../modules/clean-css/lib/clean');

var base = require('../base');

var cssHandler = cssHandler || {};

cssHandler.unpackCss = function(rootPath, buildPath, cssConfig) {
    var ignoreFilesPath = [];
    var copyFilesPath = [];
    var cleanFilesPath = [];

    var index = 0;
    var functions = [];

    if (!cssConfig.cssEnergy || cssConfig.cssEnergy.length == 0) {
        console.log("[unpackCss error] cssEnergy not be found");
        return ;
    }

    cssConfig.ignore? functions.push(_walkForIgnore) : '';
    cssConfig.copyOnly? functions.push(_walkForCopy) : '';
    cssConfig.cssEnergy? functions.push(_walkForClean) : '';
    
    (functions[index])();

    function _nextStep() {
        return functions[++index];
    }

    function _walkForIgnore() {
        var ignoreWalking = 0;
        cssConfig.ignore.map(function(ignorePath) {
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
            })(ignorePath);
        });
        if (ignoreWalking == 0) {
            (_nextStep())();
        }
    }

    function _doIgnore(devPath) {
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "css") {
            ignoreFilesPath.push(devPath);
        }
    }

    function _walkForCopy() {
        var copyWalking = 0;
        cssConfig.copyOnly.map(function(copyFilePath) {
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
        if (suffix == "css") {
            copyFilesPath.push(devPath);
            base.copyFile(rootPath, buildPath, path);
        }
    }

    function _walkForClean() {
        var compressWalking = 0;
        cssConfig.cssEnergy.map(function(cssEnergyPath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                var devPath = rootPath + path;
                if (devPath[devPath.length - 1] == '/') {
                    ++compressWalking;
                    var walker = walk.walk(devPath.substr(0, devPath.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var fileRootPathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name;
                        var filePathName = fileRootPathName.substr(rootPath.length);
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--compressWalking == 0) {
                            _cleanFiles(cleanFilesPath, buildPath + '/min.css');
                        }
                    });
                } else {
                    _doClean(devPath);
                }
            })(cssEnergyPath);
        });
        if (compressWalking == 0) {
            _cleanFiles(cleanFilesPath, buildPath + '/min.css');
        }
    } 

    function _doClean(devPath) {
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
        if (suffix == "css") {
            cleanFilesPath.push(devPath);
        }
    }

    function _cleanFiles(fileIn, fileOut) {
        if (fileIn.length > 0) {
            var finalCode = [];
            var origCode = "";
            for (var i = 0, len = fileIn.length; i < len; ++i) {
                console.log("[cleaning css] cleaning " + fileIn[i]);
                origCode = fs.readFileSync(fileIn[i], 'utf8');
                var minCss = cleanCSS.process(origCode, { debug: false });
                finalCode.push(minCss);
            };
            fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
        }
    }
};

module.exports = cssHandler;