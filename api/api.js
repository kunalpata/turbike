const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const handlebars = require('express-handlebars').create({ defaultLayout: 'main'});
const path = require('path');
const cors = require('cors');

const app = express();


//add dotenv functionality
require('dotenv').config();

//config the app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Allow the use of static files
app.use('/static', express.static('public')); 

//Use handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Accept server port from commandline
app.set('port', process.env.PORT || 9000);

//Specify static files routes
app.use(express.static(path.join(__dirname, '/public')));

// Server the static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client/build')));

//CORS-enabled
app.use(cors({
	//origin: "http://localhost:3000",  //react server
	credentials: true
}));

//User login and session functionalities
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true
	})
);
app.use(cookieParser(process.env.SESSION_SECRET));

//authentication routes
app.post("/api/login", (req, res) => {
	console.log(req.body);
	res.send({login:"good"});
})
app.post("/api/register", (req, res) => {
	console.log(req.body);
	res.send({register:"good"});
})
app.get("/api/user", (req, res) => {

})

// Specify remaining routes
app.use('/', require('./routes/index.js'));
// Handle reqs that don't match any other routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '/client/build/index.html'));
});


//Go here when 404
app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

//Go here when 500 error
app.use(function(err, req, res, next) {
	console.error(err);
	res.status(500);
	res.render('500');
});

//Server
app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});