/*var http = require('http');
var server = http.createServer((req, res)=> {
	console.log('request on : ' + req.url + ' | Method : ' + req.method);
	res.writeHead(200 , {'Content-Type' : 'text/html'});
	if(req.connection.remoteAddress === '::1'){
		env = 'local';
	}
	res.end('it works at ' + req.connection.remoteAddress);
});
*/