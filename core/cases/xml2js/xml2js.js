var fs = require('fs'),
    xml2js = require('../../libs/node-xml2js/lib/xml2js.js');

var parser = new xml2js.Parser();

parser.on('end', function(result) {
  	console.log(result);
});

fs.readFile('./test.xml', function(err, data) {
	console.log(data);
  	parser.parseString(data);
});