var env = process.env.NODE_ENV;
var mysql = require('mysql');
var path  = require('path');
var bodyParser    = require('body-parser');
var express = require('express');
var app  = express();
var port = process.env.PORT || 3000;
var connection;

if(port === 3000){
	// only for local database
	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'codaj'
	});

	connection.connect(function(err){
		if(!err){
			console.log('Database is connected ...');
		}else{
			console.log('Error connecting database');
		}
	});
}

/* configuration */
app.use(express.static(__dirname + '/public'));
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