var config = config || {};

(function (c) {
    var configs = [{
        args: {
            packPath: "",
            packName: ""
        },
        copy: [],
        compression: []
    }];

    c.getConfigs = function () {
        return configs;
    }
})(config);

module.exports = config;