var env = process.env.NODE_ENV;
var path = require('path');
var bodyParser    = require('body-parser');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

/* configuration */
app.use(express.static(__dirname + '/src/assets'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
 });


app.get('/' , (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port , () =>{
	console.log('works on port : ' + process.env.PORT);
});

// TODO => if NODE ENV == PROD / PREPROD / DEV