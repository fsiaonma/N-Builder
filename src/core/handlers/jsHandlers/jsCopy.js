var fs = require('fs'); 
var walk = require('walk');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

var base = require('../../common/base');

var jsCopy = (function() {
	var copyFilesPath = [];

	var doCopy = function(rootPath, buildPath, paths, devPath, path, isMerge) {
        for (var i = 0, len = paths.ignore.length; i < len; ++i) {
            if (paths.ignore[i] == devPath) {
                return ;
            }
        }
        var suffix = devPath.substr(devPath.lastIndexOf('.') + 1, devPath.length - 1);
        if (suffix == "js") {
            copyFilesPath.push(devPath);
            var fileInPath = rootPath + path;
            var fileOutPath = buildPath + path;
            if (isMerge) {
                doCompression(fileInPath, fileOutPath);
            } else {
                base.copyFile(fileInPath, fileOutPath);
            }
        }
    }

    var doCompression = function(fileIn, fileOut) {
        var finalCode = [];
        var origCode = "";
        var ast = "";
        console.log("[compressing js] compressing " + fileIn);
        origCode = fs.readFileSync(fileIn, 'utf8');
        ast = jsp.parse(origCode);
        ast = pro.ast_mangle(ast); 
        ast = pro.ast_squeeze(ast);
        finalCode.push(pro.gen_code(ast), ';');
        base.createFloder(fileOut.substr(0, fileOut.lastIndexOf("/")), function(){
            fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
        });
    }

    var o = {};

	o.walkForPaths = function(rootPath, buildPath, jsConfig, paths, callback) {
        var copyWalking = 0;

        jsConfig.copyOnly.map(function(copyConfig) {
            (function(config) {
                config.dir.map(function(copyFilePath) {
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
                                    callback && callback(copyFilesPath);
                                }
                            });
                        } else {
                            doCopy(rootPath, buildPath, paths, devPath, path, config.merge);
                        }
                    })(copyFilePath);
                });
            })(copyConfig);
        });

        if (copyWalking == 0) {
            callback && callback(copyFilesPath);
        }
    }

	return o;
})()

module.exports = jsCopy;