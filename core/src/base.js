var fs = require('../modules/fs'); 
var util = require("../modules/util");

var base = function() {}

base.copyFile = function(fileIn, fileOutPath) {
    var is = fs.createReadStream(fileIn);
    console.log("copy " + fileIn + " to " + fileOutPath + fileIn);
    var os = fs.createWriteStream(fileOutPath + fileIn);
    util.pump(is, os, function(err){
        if(err) {
            console.log("copy err: " + err);
        }
    });
}

base.createFloder = function(buildPath, path) {
    var arr = path.split('/');
    var index = 0;
    (function() {
        var callFunc = arguments.callee;
        var self = this;
        fs.readdir(buildPath + arr[index], function(err, files) {
            err? fs.mkdir(buildPath + arr[index]) : '';
            buildPath = buildPath + arr[index] + '/';
            if (++index < arr.length) {
                callFunc.call(self);
            }
        })
    })();
}

module.exports = base;
