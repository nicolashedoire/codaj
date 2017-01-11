var env = process.env.NODE_ENV;
var express = require('express');
var app = express();


app.get('/' , (req, res) => {

	res.send('Hello world');
});

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
server.listen(process.env.PORT || 3000 , () =>{
	console.log('works on port : ' + process.env.PORT);
});

// TODO => if NODE ENV == PROD / PREPROD / DEV