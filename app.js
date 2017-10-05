var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users'])
var ObjectId = mongojs.ObjectId;
var app = express();

/*
var logger = function(req, res, next){
	console.log('Logging...');
	next();
}

app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

// Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		 	root = namespace.shift(),
		 	 formParam = root;
	

	while(namespace.Lenght) {
		formParam += '[' + namespace.shift() + ']';		
	}
	return {
			param : formParam,
			msg : msg,
			value : value
		};
	}	
}));

// parsing json object
/*var person = {
	name:'Jeff',
	age:30
}*/
// parsing array of object
// var people = [ 
// 	{
// 		name:'Jeff',
// 		age:30
// 	},
// 	{
// 		name:'Sara',
// 		age:22
// 	},
// 	{
// 		name:'John',
// 		age:21
// 	}
// ]

// app.get('/', function(req,res){
// 	res.json(people);
// });


// route for homepage http://127.0.0.1:3000/
app.get('/', function(req,res){
	// find everything
	db.users.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
		console.log(docs);
		res.render('index', {
			title: 'Customers',
			users: docs
		});
	})
	//console.log(users);
});

// route for http://127.0.0.1:3000/users/add action

app.post('/users/add', function(req,res){

	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		});
		// console.log('errors');
	}else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}

		db.users.insert(newUser, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});
	}

});

// Delete route
app.delete('/users/delete/:id', function(req,res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/')
	});
});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');
});
