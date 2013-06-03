var config = config || {};

(function (c) {
    var configs = [{
        args: {
            packPath: "./test/",
            packName: "min.js",
        },
        copy: ["./config.js", "./minify.bat"],
        compression: ["./config.js"]
    }];

    c.getConfigs = function () {
        return configs;
    }
})(config);

module.exports = config;