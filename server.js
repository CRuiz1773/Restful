//Base Setup
//======================================================================================================

//Call the packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var User = require('./app/models/user');


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

//Connect to our database (hosted on modulus.io)
mongoose.createConnection('mongodb://localhost:27017/myDatabase');

//Routes for our API
//=================================================================================================

//Basic route for our homepage
app.get('/',function(req,res){
	res.send('Welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();

//middleware to use for all requests
apiRouter.use(function(req, res, next){
	//do logging
	console.log('Somebody just came to our app!');
	//We'll add more here in a bit
	//this is where we will authenticate users

	//We will also add next() to indicate to our application that it should continue to the other routes or next middleware. This is important because our application
	//would stop at this middleware without it.
	next(); 
});

//create a user(accessed at POST http://localhost:8080/api/users)
apiRouter.route('/users').post(function(req,res){

		//Create a new instance of the user model
		var user = new User();

		//set the users information (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		//save the user and check for errors
		user.save(function(err){
			if(err)
			{
				//duplicate entry
				if(err.code == 11000)
					return res.json({success: false, message: 'A user with that username already exists.'});
				else
					return res.send(err);
			}
				res.json({message: 'User created!'});
		});
	});

//test route to make sure everything is working
//accessed at GET http://localhost:8080/api
apiRouter.get('/',function(req,res){
	res.json({message: 'hooray! Welcome to our api!'});
});

//more routes for our API will happen here

//Register our routes
//=================================================================================================================

app.use('/api', apiRouter);

//Start the server
app.listen(port);
console.log('Magic happens on port ' + port);


//This is a test for github