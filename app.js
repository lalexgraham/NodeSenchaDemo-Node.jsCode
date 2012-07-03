
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// mongoose configuration

var mongoose = require('mongoose');

//local db
mongoose.connect('mongodb://127.0.0.1/demo');

//mongoose.connect('mongodb://admin:admin@staff.mongohq.com:10091/artsfest');

mongoose.connect('mongodb://test:test@staff.mongohq.com:10081/senchaDemo');

//create the marker Model using the 'marker' collection as a data-source
markerModel = mongoose.model('marker', new mongoose.Schema({
    markerID: String,
    title: String,
    lng: String,
    lat: String,
    icon: String,
    description: String
}));


eventModel = mongoose.model('event', new mongoose.Schema({
	id:String,	
	markerID: String,
	title: String,
	description: String,
	day:String,
	time:String,
	trueVenue:String,
	venue:String
	
}));



// Routes

//default url
app.get('/', function (req, res) {
   res.redirect('/markers');
});


//get all markers
//http://localhost:5000/markers
app.get('/markers', function (req, res) {

	// Allow Cross Domain Request from anywhere...
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	markerModel.find({}, function (err, markers) {
	      	res.contentType('json');
		res.write(req.query.callback+ '({"success":true,"data":' +  JSON.stringify(markers)+ '})');
		res.end();
	});
});

// get all events
//http://localhost:5000/events/
app.get('/events', function(req, res) {
	// Allow Cross Domain Request from anywhere...
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	eventModel.find({}, function (err,events) {
		res.contentType('json');
		res.write(req.query.callback+ '({"success":true,"data":' +  JSON.stringify(events)+ '})');
		res.end();
	});
});


//get specific marker
//http://localhost:5000/marker/1234
/*app.get('/marker/:markerid', function (req, res) {
	
	// Allow Cross Domain Request from anywhere...
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	console.log(req.params.markerid);
	markerModel.find({markerID: +req.params.markerid}, function (err, markers) {
	        res.contentType('json');
	       	res.write(req.query.callback+ '({"success":true,"data":' +  JSON.stringify(markers)+ '})');
		res.end();
	});
});*/


//get events for marker id
//http://localhost:5000/events/1234
app.get('/events/:markerid', function(req, res) {
	// Allow Cross Domain Request from anywhere...
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	eventModel.find({markerID: +req.params.markerid}, function (err,events) {
		res.contentType('json');
		res.write(req.query.callback+ '({"success":true,"data":' +  JSON.stringify(events)+ '})');
		res.end();
 	});
});



app.listen(process.env.PORT || 5000);
console.log('Running on Node.js Version: ' + process.version);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
