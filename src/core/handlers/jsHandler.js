var fs = require('../../modules/fs'); 
var walk = require('../../modules/walk');
var jsp = require("../../modules/uglify-js").parser;
var pro = require("../../modules/uglify-js").uglify;

var base = require('../base');

var jsHandler = jsHandler || {};

jsHandler.unpackJs = function(rootPath, buildPath, jsConfig) {
    var ignoreFilesPath = [];
    var copyFilesPath = [];
    var compressionFilesPath = [];

    var index = 0;
    var functions = [];

    if (!jsConfig.jsEnergy || jsConfig.jsEnergy.length == 0) {
        console.log("[unpackJs error] jsEnergy not be found");
        return ;
    }

    jsConfig.ignore? functions.push(_walkForIgnore) : '';
    jsConfig.copyOnly? functions.push(_walkForCopy) : '';
    jsConfig.jsEnergy? functions.push(_walkForCompression) : '';
    
    (functions[index])();

    function _nextStep() {
        return functions[++index];
    }

    function _walkForIgnore() {
        var ignoreWalking = 0;
        jsConfig.ignore.map(function(ignoreFilePath) {
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
        if (suffix == "js") {
            ignoreFilesPath.push(devPath);
        }
    }

    function _walkForCopy() {
        var copyWalking = 0;
        jsConfig.copyOnly.map(function(copyFilePath) {
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
        if (suffix == "js") {
            copyFilesPath.push(devPath);
            base.copyFile(rootPath, buildPath, path);
        }
    }

    function _walkForCompression() {
        var compressWalking = 0;
        jsConfig.jsEnergy.map(function(jsEnergyPath) {
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
                            _compressionFiles(compressionFilesPath, buildPath + '/min.js');
                        }
                    });
                } else {
                    _doCompression(devPath);
                }
            })(jsEnergyPath);
        });
        if (compressWalking == 0) {
            _compressionFiles(compressionFilesPath, buildPath + '/min.js');
        }
    } 

    function _doCompression(devPath) {
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
        if (suffix == "js") {
            compressionFilesPath.push(devPath);
        }
    }

    function _compressionFiles(fileIn, fileOut) {
        if (fileIn.length > 0) {
            var finalCode = [];
            var origCode = "";
            var ast = "";
            for (var i = 0, len = fileIn.length; i < len; ++i) {
                console.log("[compressing js] compressing " + fileIn[i]);
                origCode = fs.readFileSync(fileIn[i], 'utf8');
                ast = jsp.parse(origCode); 
                ast = pro.ast_mangle(ast); 
                ast = pro.ast_squeeze(ast);
                finalCode.push(pro.gen_code(ast), ';');
            };
            fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
        }
    }
};

module.exports = jsHandler;