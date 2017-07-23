//Base Setup

//Call the packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

//App Config
//Use body parser so we can grab informnation from POST requests
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


//Configure our app to handle CORS requests
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods','Get, POST');
	res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, /Authorization');
	next();
});

//Log all requests to the console
app.use(morgan('dev'));

//Routes for our API

//Basic route for our homepage
app.get('/',function(req,res){
	res.send('Welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();

//test route to make sure everything is working
//accessed at GET http://localhost:8080/api
apiRouter.get('/',function(req,res){
	res.json({message: 'hooray! Welcome to our api!'});
});

//more routes for our API will happen here

//Register our routes

app.use('/api', apiRouter);

//Start the server
app.listen(port);
console.log('Magic happens on port ' + port);