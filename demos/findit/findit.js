var findit = require('../../libs/node-findit/index.js');

var finder = findit.find('./test', function (file) {
	console.log(file);
});

var files = findit.findSync('./test/');
console.dir(files);

finder.on('directory', function (dir) {
    console.log(dir + '/');
});

finder.on('file', function (file) {
    console.log(file);
});
