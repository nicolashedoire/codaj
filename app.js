var env = process.env.NODE_ENV;
var mysql = require('mysql');
var path  = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var bodyParser    = require('body-parser');
var twig = require('twig');
var express = require('express');

var config = require('./configuration/config');

var app  = express();
var port = process.env.PORT || 3000;
var connection;

// only for local database
connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

if(config.use_database === 'true'){
	connection.connect(function(err){
		if(!err){
			console.log('Database is connected ...');
		}else{
			console.log('Error connecting database');
		}
	});
}

/* configuration */
/*app.use(express.logger('dev'));*/
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

app.set('view engine', 'twig');
// This section is optional and used to configure twig. 
app.set("twig options", {
    strict_variables: false
});

app.use(session({
    secret: 'cookie_secret',
    name: 'cookie_name',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	console.log(obj);
	done(null, obj);
});

/*config is our configuration variable.*/
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database==='true')
      {
         //Further code of Database.
      }
      return done(null, profile);
    });
  }
));

app.get('/' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	
	var query = 'SELECT id , name , slug , description from technologies';
	connection.query( query , function(err , rows , fields) {
		if(err) throw err;
		res.render('home/homepage.twig', {
   			items: rows,
   			buttonDiscover : 'Discover'
		});
	});
});

app.get('/dashboard' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('dashboard/dashboard.twig');
});

app.get('/code' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('code/code.twig');
});

app.get('/tests' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('tests/tests.twig');
});

app.get('/database' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	var query = 'SELECT q.id, q.name as questionName , q.tech_id , t.name as technoName from questions as q INNER JOIN technologies as t on t.id = q.tech_id';
	connection.query( query , function(err , rows , fields) {
		if(err) throw err;
		res.render('database/database.twig' , {
			questions : rows
		});
	});
});

app.get('/myaccount' , ensureAuthenticated , (req , res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	console.log(req.user);
	res.render('account/myaccount.twig');
});


// URL for Oauth facebook

app.get('/auth/facebook' , passport.authenticate('facebook'));

app.get('/auth/facebook/callback' ,  passport.authenticate('facebook', { 
       successRedirect : '/success', 
       failureRedirect: '/error' 
  }),
  function(req, res) {
  	console.log(req);
    res.redirect('/');
  });

app.get('/logout' , (req, res , next) => {
  console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
  req.logout();
  res.redirect('/');
});

app.get('/success', function(req, res, next) {
   res.redirect('/');
});

app.get('/error', function(req, res, next) {
  res.send("Error logging in.");
});

function ensureAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
  if (req.isAuthenticated()) { return next(); }
}

// End Oauth facebook

app.get('/technology/:itemName' , (req , res , next) => {
	// condition for local only
	var query = 'SELECT q.id , q.name FROM technologies as t inner join questions as q on q.tech_id = t.id WHERE t.slug=?';
	connection.query( query , req.params.itemName , function(err , rows , fields) {
		if(err) throw err;
		res.render('detailsTechnology/detailsTechnology.twig' , {
			dirname: __dirname,
			questions : rows
		});
	});
});

app.post('/insertQuestion' , (req, res , next) => {
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