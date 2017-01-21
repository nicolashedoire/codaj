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
    callbackURL: config.callback_url,
    profileFields: ['id', 'displayName', 'emails' , 'name', 'gender', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
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
	   			username : req.session.username,
	   			avatar : req.session.avatar,
	   			arianeText : false
			});
		});
	});
});

app.get('/dashboard' , (req, res , next) => {
	req.session.connected = false;
	if (req.isAuthenticated()){
		req.session.connected = true;
	}

	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('dashboard/dashboard.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username ,
	   	avatar : req.session.avatar,
	   	arianeText : req.url.substring(1)
	});
});

app.get('/code' , (req, res , next) => {
	req.session.connected = false;
	if (req.isAuthenticated()){
		req.session.connected = true;
	}

	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('code/code.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username , 
	   	avatar : req.session.avatar,
	   	arianeText : req.url.substring(1)
	});
});

app.get('/tests' , (req, res , next) => {

	req.session.connected = false;
	if (req.isAuthenticated()){
		req.session.connected = true;
	}

	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('tests/tests.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username , 
	   	avatar : req.session.avatar,
	   	arianeText : req.url.substring(1)
	});
});

app.get('/database' , (req, res , next) => {
	req.session.connected = false;
	if (req.isAuthenticated()){
		req.session.connected = true;
	}
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	var query = 'SELECT q.id, q.name as questionName , q.tech_id , t.name as technoName from questions as q INNER JOIN technologies as t on t.id = q.tech_id LIMIT 10 OFFSET 0';
	connection.query( query , function(err , rows , fields) {
		if(err) throw err;
		var query = 'SELECT count(id) as total from questions';
		var questions = rows;
		connection.query( query , function(err , rows , fields) {
			var numberPerPage = 10;
			var pages = Math.ceil(rows[0].total / numberPerPage);
			console.log(pages);
			res.render('database/database.twig' , {
				questions : questions,
				connected : req.session.connected , 
		   		username : req.session.username,
		   		avatar : req.session.avatar,
		   		total : rows[0].total,
		   		numberPages : parseInt(pages),
		   		arianeText : req.url.substring(1),
		   		currentPage : 1
			});
		});
	});
});


app.get('/database/page/:id' , (req, res , next) => {
	var idPage = req.params.id;
	var offset = 10 * parseInt(idPage - 1);
	req.session.connected = false;
	if (req.isAuthenticated()){
		req.session.connected = true;
	}
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	var query = 'SELECT q.id, q.name as questionName , q.tech_id , t.name as technoName from questions as q INNER JOIN technologies as t on t.id = q.tech_id LIMIT 10 OFFSET ?';
	connection.query( query , offset ,  function(err , rows , fields) {
		if(err) throw err;
		var query = 'SELECT count(id) as total from questions';
		var questions = rows;
		connection.query( query , function(err , rows , fields) {
			var numberPerPage = 10;
			var pages = Math.ceil(rows[0].total / numberPerPage);
			var arianeText = req.url.substring(1);
			arianeText = arianeText.replace(new RegExp('/', 'g') , ' / ');
			res.render('database/database.twig' , {
				questions : questions,
				connected : req.session.connected , 
		   		username : req.session.username,
		   		avatar : req.session.avatar,
		   		total : rows[0].total,
		   		numberPages : parseInt(pages),
		   		arianeText : arianeText,
		   		currentPage : idPage
			});
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
	   	username : req.session.username,
	   	avatar : req.session.avatar,
	   	arianeText : req.url.substring(1)
	});
});

app.get('/subscriptions' , ensureAuthenticated , (req , res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	res.render('subscriptions/subscriptions.twig' , {
		connected : req.session.connected , 
	   	username : req.session.username ,
	   	avatar : req.session.avatar,
	   	arianeText : req.url.substring(1)
	});
});

// URL for Oauth facebook
app.get('/auth/facebook' , passport.authenticate('facebook'));

app.get('/auth/facebook/callback' ,  passport.authenticate('facebook', { 
       successRedirect : '/success', 
       failureRedirect: '/error' 
  })
);

app.get('/logout' , ensureAuthenticated , (req, res , next) => {
  console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
  req.session.destroy();
  req.logout();
  res.redirect('/');
});


// Comment trouver la position d'un mot dans une chaîne de caractère ?

app.get('/success', function(req, res, next) {
      //Check whether the User exists or not using profile.id
      var iddb = '';
      if(config.use_database==='true')
      {
         //Further code of Database.
         /*console.log(profile.id , profile.displayName);*/
         var query = 'SELECT id, facebook_id , role , fullname , avatar_url FROM utilisateurs WHERE facebook_id = ?';
         var user = '';
         var facebook_id = parseInt(req.user.id);
         connection.query( query  , facebook_id , (err , rows , fields) => {
         	if(err){
         		console.log(err);
         		return;
         	}
         	if(rows.length === 0){
         		console.log('Creation du compte en cours');
         		var query = 'INSERT INTO utilisateurs set ?';
         		var account = {
         			facebook_id : req.user.id,
         			fullname : req.user.displayName,
         			gender : req.user.gender,
         			name : req.user.name.familyName,
         			lastname : req.user.name.givenName,
         			avatar_url : req.user.photos[0].value
         		}
         		connection.query( query , account , (err , result) => {
         			if(err) throw err;
         		});
         	}else{
         		// add id in database in profile data
         		req.session.iddb = rows[0].id;
         		user = rows[0].fullname;
         		console.log('jai trouvé le compte de : ' + user);
         	}
         	req.session.username = req.user.displayName;
         	req.session.avatar = req.user.photos[0].value;
   			res.redirect('/');
         });
      }
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
		console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	// condition for local only
	var query = 'SELECT q.id , q.name , q.user_id , t.name as technologie , u.avatar_url as avatar , u.fullname FROM technologies as t inner join questions as q on q.tech_id = t.id INNER JOIN utilisateurs as u on u.id = q.user_id WHERE t.slug=?';
	connection.query( query , req.params.itemName , function(err , rows , fields) {
		if(err) throw err;
		var results = false;
		if(rows.length > 0){
			results = true;
		}
		var arianeText = req.url.substring(1);
		arianeText = arianeText.replace('/' , ' / ');
		res.render('detailsTechnology/detailsTechnology.twig' , {
			dirname: __dirname,
			questions : rows, 
			connected : req.session.connected , 
	   		username : req.session.username,
	   		avatar : req.session.avatar,
	   		arianeText : arianeText,
	   		url : req.url,
	   		results : results,
	   		noResults : 'il n\'y a pas encore de questions pour cette technologie...'
		});
	});
});


app.get('/technology/:itemName/question/:id' , (req , res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	// condition for local only
	var query = 'SELECT q.id , q.name FROM questions as q WHERE q.id=?';
	connection.query( query , req.params.id , function(err , rows , fields) {
		if(err) throw err;
		var arianeText = req.url.substring(1);
		arianeText = arianeText.replace(new RegExp('/', 'g') , ' / ');
		res.render('detailsQuestion/detailsQuestion.twig' , {
			dirname: __dirname,
			question : rows, 
			connected : req.session.connected , 
	   		username : req.session.username,
	   		avatar : req.session.avatar,
	   		arianeText : arianeText,
	   		url : req.url
		});
	});
});


app.get('/metier/:name/tests' , (req , res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	// condition for local only
	var query = 'SELECT t.id , t.name , t.description , t.metier_id , m.slug , m.name as metier FROM tests as t INNER JOIN metiers as m on m.id = t.metier_id WHERE m.slug=?';
	connection.query( query , req.params.name , function(err , rows , fields) {
		if(err) throw err;
		var arianeText = req.url.substring(1);
		var results = false;
		if(rows.length > 0){
			results = true;
		}
		arianeText = arianeText.replace(new RegExp('/', 'g') , ' / ');
		res.render('tests/tests.twig' , {
			dirname: __dirname,
			tests : rows, 
			connected : req.session.connected , 
	   		username : req.session.username,
	   		avatar : req.session.avatar,
	   		arianeText : arianeText,
	   		url : req.url,
	   		results : results,
	   		noResults : 'il n\'y a pas encore de tests pour ce metier...'
		});
	});
});


app.get('/metier/:name/tests/:id' , (req , res , next) => {
	console.log('request on : ' + req.url + ' | Method : ' + req.method + ' | Adress : ' + req.connection.remoteAddress);
	// condition for local only
	var query = 'SELECT t.id , t.name , t.description , t.metier_id FROM tests as t WHERE t.id=?';
	connection.query( query , req.params.name , function(err , rows , fields) {
		if(err) throw err;
		var arianeText = req.url.substring(1);
		arianeText = arianeText.replace(new RegExp('/', 'g') , ' / ');
		res.render('tests/testDetails.twig' , {
			dirname: __dirname,
			tests : rows, 
			connected : req.session.connected , 
	   		username : req.session.username,
	   		avatar : req.session.avatar,
	   		arianeText : arianeText,
	   		url : req.url
		});
	});
});


app.post('/insertQuestion' , (req, res , next) => {
	console.log('-------------------------------');
	console.log(req.body.question , req.body.technologieId , req.session.iddb , req.session.username);
	var post = {
		name 	: req.body.question ,
		tech_id : parseInt(req.body.technologieId),
		user_id : req.session.iddb
	}
	// condition for local only
	var query = 'INSERT INTO questions SET ?';
	connection.query(query , post , (err , result) =>{
		if(!err){
			res.end('ok');
		}else{
			console.log(err);
		}
	});
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