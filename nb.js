var fs  = require('fs'); 
var util = require("util");
var config = require('./config.js');
var jsp = require("./libs/uglify-js").parser;
var pro = require("./libs/uglify-js").uglify;

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

(function() {
    config.map(function(item) {
        var packPath = item.args.packPath;
        var packName = item.args.packName;
        console.log(item.compression, packPath + packName);
        compressionFiles(item.compression, packPath + packName);
        copyFiles(item.copy, packPath);
    });
})();
