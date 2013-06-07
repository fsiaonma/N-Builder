var fs = require('fs'),
	cleanCSS = require('../../libs/clean-css/index');

var bigCss = require('fs').readFileSync(require('path').join(__dirname, 'test.css'), 'utf8');

console.log(bigCss);

var minCss = cleanCSS.process(bigCss, { debug: true });

console.log(minCss);

var stream = fs.createWriteStream("./min.css");
stream.once('open', function(fd) {
  stream.write(minCss);
  stream.write(minCss);
  stream.end();
});

