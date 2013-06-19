var fs = require('../modules/fs'); 
var walk = require('../modules/walk');
var jsp = require("../modules/uglify-js").parser;
var pro = require("../modules/uglify-js").uglify;

var base = require('./base');

var jsHandler = jsHandler || {};

jsHandler.unpackJs = function(buildPath, jsConfig) {
    var ignorePath = [];
    var copyFilesPath = [];
    var compressionFilesPath = [];

    var index = 0;
    var functions = [];
    jsConfig.ignore? functions.push(_walkForIgnore) : '';
    jsConfig.copyOnly? functions.push(_walkForCopy) : '';
    jsConfig.jsEnergy? functions.push(_walkForCompression) : '';
    functions[index]();

    function _nextStep() {
        return functions[++index];
    }

    function _walkForIgnore() {
        var ignoreWalking = 0;

        jsConfig.ignore.map(function(path) {
            if (path[path.length - 1] == '/') {
                ++ignoreWalking;
                var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                walker.on("file", function (root, fileStats, next) {
                    var filePathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                    var suffix = filePathName.substr(filePathName.lastIndexOf('.') + 1, filePathName.length - 1);
                    suffix == "js" ? ignorePath.push(filePathName) : ''
                    next();
                });
                walker.on("end", function() {
                    if (--ignoreWalking == 0) {
                        (_nextStep())();
                    }
                });
            } else {
                var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                if (suffix == "js") {
                    ignorePath.push(path);
                }
            }
        });
        
        if (ignoreWalking == 0) {
            (_nextStep())();
        }
    }

    function _walkForCopy() {
        var copyWalking = 0;

        jsConfig.copyOnly.map(function(copyFilePath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                if (path[path.length - 1] == '/') {
                    ++copyWalking;
                    var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var filePathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--copyWalking == 0) {
                            (_nextStep())();
                        }
                    });
                } else {
                    for (var i = 0, len = ignorePath.length; i < len; ++i) {
                        if (ignorePath[i] == path) {
                            return ;
                        }
                    }

                    var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                    if (suffix == "js") {
                        copyFilesPath.push(path);
                        base.copyFile(buildPath, path);
                    }
                }
            })(copyFilePath);
        });
        
        if (copyWalking == 0) {
            (_nextStep())();
        }
    }

    function _walkForCompression() {
        var compressWalking = 0;

        jsConfig.jsEnergy.map(function(jsEnergyPath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                if (path[path.length - 1] == '/') {
                    ++compressWalking;
                    var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var filePathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--compressWalking == 0) {
                            _compressionFiles(compressionFilesPath, buildPath + '/min.js');
                        }
                    });
                } else {
                    for (var i = 0, len = copyFilesPath.length; i < len; ++i) {
                        if (copyFilesPath[i] == path) {
                            return ;
                        }
                    }

                    for (var i = 0, len = ignorePath.length; i < len; ++i) {
                        if (ignorePath[i] == path) {
                            return ;
                        }
                    }
                        
                    var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                    if (suffix == "js") {
                        compressionFilesPath.push(path);
                    }
                }
            })(jsEnergyPath);
        });
        
        if (compressWalking == 0) {
            _compressionFiles(compressionFilesPath, buildPath + '/min.js');
        }
    } 

    function _compressionFiles(fileIn, fileOut) {
        if (fileIn.length > 0) {
            var finalCode = [];
            var origCode = "";
            var ast = "";
            for (var i = 0, len = fileIn.length; i < len; ++i) {
                console.log("[compressing] compressing " + fileIn[i]);
                origCode = fs.readFileSync(fileIn[i], 'utf8');
                ast = jsp.parse(origCode); 
                ast = pro.ast_mangle(ast); 
                ast = pro.ast_squeeze(ast);
                finalCode.push(pro.gen_code(ast), ';');
            };
            fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
        }
    }
}

module.exports = jsHandler;