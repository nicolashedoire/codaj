var env = process.env.NODE_ENV;
var mysql = require('mysql');
var path  = require('path');
var passport = require('passport');
var compression = require('compression');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var bodyParser    = require('body-parser');
var twig = require('twig');
var express = require('express');

var config = require('./configuration/config');

var app  = express();
app.use(compression());
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
    name: 'session',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
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
         /*console.log(profile.id , profile.displayName);*/
         var query = 'SELECT facebook_id , role , fullname FROM utilisateurs WHERE facebook_id = ?';
         var user = '';
         connection.query( query  , profile.id , (err , rows , fields) => {
         	if(err) throw err;
         	user = rows[0].fullname;
         	if(rows.length === 0){
         		console.log('Creation du compte en cours');
         		var query = 'INSERT INTO utilisateurs set ?';
         		var account = {
         			facebook_id : profile.id,
         			fullname : profile.displayName
         		}
         		connection.query( query , account , (err , result) => {
         			if(err) throw err;
         		});
         	}else{
         		console.log('jai trouvé le compte de : ' + user);
         	}
         });
      }
      return done(null, profile);
    });
  }
));

app.get('/' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	req.session.connected = false;
	if (req.isAuthenticated()){
		req.session.connected = true;
	}
	var query = 'SELECT id , name , slug , description from technologies';
	connection.query( query , function(err , rows , fields) {
		if(err) throw err;
		var categories = rows;
		var query = 'SELECT id , name , slug , description from metiers';
		connection.query( query , function(err , rows , fields) {
			if(err) throw err;
			var metiers = rows
			res.render('home/homepage.twig', {
	   			items: categories,
	   			metiers : metiers,
	   			buttonDiscover : 'Discover',
	   			buttonTest : 'Test yourself',
	   			connected : req.session.connected , 
	   			username : req.session.username
			});
		});
	});
});

app.get('/dashboard' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('dashboard/dashboard.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username
	});
});

app.get('/code' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('code/code.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username
	});
});

app.get('/tests' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('tests/tests.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username
	});
});

app.get('/database' , (req, res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	var query = 'SELECT q.id, q.name as questionName , q.tech_id , t.name as technoName from questions as q INNER JOIN technologies as t on t.id = q.tech_id';
	connection.query( query , function(err , rows , fields) {
		if(err) throw err;
		res.render('database/database.twig' , {
			questions : rows,
			connected : req.session.connected , 
	   		username : req.session.username
		});
	});
});

app.get('/myaccount' , ensureAuthenticated , (req , res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('account/myaccount.twig' , {
/*		myaccountTitle : 'Account',
		profileTitle : 'Profile',
		updateProfile : 'Update profile',
		paymentTitle : 'Payment method',
		billingAdress : 'Billing Adress'*/
		connected : req.session.connected , 
	   	username : req.session.username
	});
});


app.get('/subscriptions' , ensureAuthenticated , (req , res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('subscriptions/subscriptions.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username
	});
});


// URL for Oauth facebook
app.get('/auth/facebook' , passport.authenticate('facebook'));

app.get('/auth/facebook/callback' ,  passport.authenticate('facebook', { 
       successRedirect : '/success', 
       failureRedirect: '/error' 
  }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout' , ensureAuthenticated , (req, res , next) => {
  console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

app.get('/success', function(req, res, next) {
   req.session.username = req.user.displayName;
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
			questions : rows, 
			connected : req.session.connected , 
	   		username : req.session.username
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

app.get('/listTechnologies' , (req , res) => {
 	// condition for local only
 	var query = 'SELECT id , name , slug  from technologies';
 	connection.query( query , function(err , rows , fields) {
 		if(err) throw err;
 		res.send(rows);
 	});
 });

app.listen(port , () =>{
	console.log('works on port : ' + process.env.PORT);
});

// TODO => if NODE ENV == PROD / PREPROD / DEV