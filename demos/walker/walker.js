var walk = require('../../libs/walk'),
    fs = require('fs'),
    options,
    walker;

options = {
    followLinks: false
};

walker = walk.walk("./img", options);

walker.on("names", function (root, nodeNamesArray) {
    nodeNamesArray.sort(function (a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });
});

walker.on("directories", function (root, dirStatsArray, next) {
    console.log(root);
    console.log(dirStatsArray);
    console.log(next);
    next();
});

walker.on("file", function (root, fileStats, next) {
    console.log(root);
    console.log(fileStats);
    console.log(next);
    fs.readFile(fileStats.name, function () {
        // doStuff
        next();
    });
});

walker.on("errors", function (root, nodeStatsArray, next) {
    next();
});

walker.on("end", function () {
    console.log("all done");
});