var fs = require('../modules/fs'); 
var util = require("../modules/util");

var base = base || {};

base.copyFile = function(rootPath, buildPath, path) {
    var folderPath = path.substr(0, path.lastIndexOf('/'));
    base.createFloder(buildPath, folderPath, function() {
        console.log("[copy] copy " + path + " to " + buildPath + path);
        var is = fs.createReadStream(rootPath + path);
        var os = fs.createWriteStream(buildPath + path);
        util.pump(is, os, function(err){
            if(err) {
                console.log("[copy] copy err: " + err);
            }
        });
    });
};

base.createFloder = function(buildPath, path, callback) {
    var arr = path.split('/');
    var index = 0;
    (function() {
        var callFunc = arguments.callee;
        var self = this;
        fs.readdir(buildPath + arr[index], function(err, files) {
            if(err) {
                fs.mkdir(buildPath + arr[index]);
                console.log("[create floder] create floder " + buildPath + arr[index]);
            }
            buildPath = buildPath + arr[index] + '/';
            if (++index < arr.length) {
                callFunc.call(self);
            } else {
                callback.call(this);
            }
        })
    })();
};

module.exports = base;
