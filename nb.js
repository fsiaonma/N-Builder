var fs  = require('fs'); 
var util = require("util");

var jsp = require("./libs/uglify-js").parser;
var pro = require("./libs/uglify-js").uglify;
var smushit = require('./libs/node-smushit/smushit');
var walk = require('./libs/walk');

var config = require('./config');

// 复制文件
function copyFile(fileIn, fileOutPath) {
    var is = fs.createReadStream(fileIn);
    console.log("copy to: " + fileOutPath + '/' + fileIn);
    var os = fs.createWriteStream(fileOutPath + '/' + fileIn);
    util.pump(is, os, function(err){
        if(err) {
            console.log("copy err: " + err);
        }
    });
}

// 批量读取文件，压缩之
function compressionFiles(fileIn, fileOut) {
    if (fileIn.length > 0) {
        var finalCode = [];
        var origCode = "";
        var ast = "";
        for (var i = 0, len = fileIn.length; i < len; ++i) {
            console.log("compressing " + fileIn[i]);
            origCode = fs.readFileSync(fileIn[i], 'utf8');
            ast = jsp.parse(origCode); 
            ast = pro.ast_mangle(ast); 
            ast = pro.ast_squeeze(ast);
            finalCode.push(pro.gen_code(ast), ';');
        };
        fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
    }
}

function createFloder(buildPath, path) {
    var arr = path.split('/');
    arr.map(function(item) {
        if (item) {
            fs.readdir(buildPath + item, function(err, files) {
                err? fs.mkdir(buildPath + item) : '';
                buildPath = buildPath + item + '/';
            })
        }
    });
    
}

// 打包 JS 文件
function unpackJs(buildPath, jsConfig) {
    var ignorePath = [];
    var copyFilesPath = [];
    var compressionFilesPath = [];

    function walkForIgnore() {
        var ignoreWalking = 0;

        jsConfig.ignore.map(function(ingorePath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                if (path[path.length - 1] == '/') {
                    ++ignoreWalking;
                    var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                    walker.on("file", function (root, fileStats, next) {
                        var filePathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--ignoreWalking == 0) {
                            walkForCopy();
                        }
                    });
                } else {
                    var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                    if (suffix == "js") {
                        ignorePath.push(path);
                    }
                }
            })(ingorePath);
        });

        if (ignoreWalking == 0) {
            walkForCopy();
        }
    }

    walkForIgnore();

    function walkForCopy() {
        var copyWalking = 0;

        jsConfig.copyOnly.map(function(copyFilePath) {
            (function(path) {
                var callFunc = arguments.callee;
                var self = this;
                if (path[path.length - 1] == '/') {
                    createFloder(buildPath, path);
                    ++copyWalking;
                    var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                    walker.on("directories", function (root, dirStatsArray, next) {
                        dirStatsArray.map(function(item) {
                            createFloder(buildPath, root + '/' + item.name);
                        })
                        next();
                    });
                    walker.on("file", function (root, fileStats, next) {
                        var filePathName = (root[root.length - 1] == '/') ? root + fileStats.name : root + '/' + fileStats.name
                        callFunc.call(self, filePathName);
                        next();
                    });
                    walker.on("end", function() {
                        if (--copyWalking == 0) {
                            walkForCompression();
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
                        copyFile(path, buildPath);
                    }
                }
            })(copyFilePath);
        });
        
        if (copyWalking == 0) {
            walkForCompression();
        }
    }

    function walkForCompression() {
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
                            compressionFiles(compressionFilesPath, buildPath + '/min.js');
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
            compressionFiles(compressionFilesPath, buildPath + '/min.js');
        }
    }   
}

// 打包图片
function unpackImages(buildPath, imagesConfig) {
    imagesConfig.path.map(function(imagesPath) {
        (function(path) {
            var callFunc = arguments.callee;
            var self = this;
            if (path[path.length - 1] == '/') {
                createFloder(buildPath, path);
                var walker = walk.walk(path.substr(0, path.lastIndexOf('/')));
                walker.on("directories", function (root, dirStatsArray, next) {
                    dirStatsArray.map(function(item) {
                        createFloder(buildPath, root + '/' + item.name);
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
                            copyFile(item, buildPath);
                        },
                    });
                }
            }  
        })(imagesPath);
    });
}

(function() {
    config.map(function(item) {
        fs.mkdir(item.buildPath);
        if (item.images) {
            unpackImages(item.buildPath, item.images)
        } 
        if (item.js) {
            unpackJs(item.buildPath, item.js);
        }
    });
})();
