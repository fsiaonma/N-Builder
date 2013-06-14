var fs  = require('fs'); 
var util = require("util");
var config = require('./config.js');
var jsp = require("./libs/uglify-js").parser;
var pro = require("./libs/uglify-js").uglify;
var smushit = require('./libs/node-smushit/smushit.js');
var walk = require('./libs/walk');

// 批量读取文件，压缩之
function compressionFiles(fileIn, fileOut) {
    if (fileIn.length > 0) {
        var finalCode = [];
        var origCode = "";
        var ast = "";
        for (var i = 0, len = fileIn.length; i < len; ++i) {
            origCode = fs.readFileSync(fileIn[i], 'utf8');
            ast = jsp.parse(origCode); 
            ast = pro.ast_mangle(ast); 
            ast = pro.ast_squeeze(ast);
            finalCode.push(pro.gen_code(ast), ';');
        };
    }
    fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
}

// 批量复制文件
function copyFiles(fileIn, fileOutPath) {
    fileIn.map(function (item) {
        var is = fs.createReadStream(item);
        var os = fs.createWriteStream(fileOutPath + item);
        util.pump(is, os, function(err){
            if(err) {
                console.log("copy err: " + err);
            }
        });
    })
}

// 批量压缩图片
function compressImages(paths) {
    paths.map(function(imagesPath) {
        (function (path) {
            var callFunc = arguments.callee;
            var self = this;
            if (path[path.length - 1] == '/') {
                var walker = walk.walk(path);
                walker.on("file", function (root, fileStats, next) {
                    console.log(root + '/' + fileStats.name);
                    callFunc.call(self, root + '/' + fileStats.name);
                    next();
                });
            } else {
                var suffix = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                if (suffix == "png" || suffix == "jpg") {
                    smushit.smushit(path);
                }
            }  
        })(imagesPath);
    });
}

(function() {
    config.items.map(function(item) {
        config.MinPng? compressImages(item.images) : '';
    });
})();
