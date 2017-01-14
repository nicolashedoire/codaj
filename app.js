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


app.get('/listQuestions' , (req , res) => {
	// condition for local only
	if(port === 3000){
		var query = 'SELECT q.id, q.name as questionName , q.tech_id , t.name as technoName from questions as q INNER JOIN technologies as t on t.id = q.tech_id';
		connection.query( query , function(err , rows , fields) {
			if(err) throw err;
			for(var i in rows){
				console.log('Post questions : ' , rows[i].name);
			}
			res.send(rows);
		});
	}
});

app.get('/listTechnologies' , (req , res) => {
	// condition for local only
	if(port === 3000){
		var query = 'SELECT id , name , slug , description from technologies';
		connection.query( query , function(err , rows , fields) {
			if(err) throw err;
			for(var i in rows){
				console.log('Post technologies : ' , rows[i].name);
			}
			res.send(rows);
		});
	}
});

app.post('/insertQuestion' , (req, res) => {
	console.log(req.body.question);
	console.log(req.body.technologieId);
	var post = {
		name 	: req.body.question ,
		tech_id : parseInt(req.body.technologieId)
	}
	// condition for local only
	if(port === 3000){
		connection.query('INSERT INTO questions SET ?' , post , (err , result) =>{
			if(!err){
				res.end();
			}
		});
	}else{
		res.end([]);
	}
});

app.listen(port , () =>{
	console.log('works on port : ' + process.env.PORT);
});

// TODO => if NODE ENV == PROD / PREPROD / DEV