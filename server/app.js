// Access the URL by http://[YourIPAddress]:8880/node_modules/gentelella/production/index.html
var PythonShell = require('python-shell');
//var influx = require('influx');

// Libraries
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
port = process.argv[2] || 8880;
var moment = require("moment");
var GeoJSON = require('geojson');

//
// INFLUX DB
//
// changed the way to use...
const Influx = require('influx');
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'benz_realtime',
  schema: [
    {
      measurement: 'car_data',
      fields: {
        path: Influx.FieldType.STRING,
        duration: Influx.FieldType.INTEGER
      },
      tags: [
        'host'
      ]
    }
  ]
})

// Sample of query
var query = "select * from car_data limit 2"
influx.query(query).then(
    result => {
	var out = GeoJSON.parse(result[0], {Point: ['latitude', 'longitude']});
	console.log(out);
    }).catch(err => {
	console.log('error');
	res.status(500).send(err.stack)
    });


//
// Set up Web Server
//
var app = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
       
    fs.exists(filename, function(exists) {
	if(!exists) {
	    response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write("404 Not Found\n");
	    response.end();
	    return;
	}
	
	//    if (fs.statSync(filename).isDirectory()) filename += 'index.html';
	fs.readFile(filename, "binary", function(err, file) {
	    if(err) {        
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.write(err + "\n");
		response.end();
		return;
	    }
	    response.writeHead(200);
	    response.write(file, "binary");
	    response.end();
	});
    });
}).listen(parseInt(port, 10));
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

//
// Web Socket
//
var io  = require('socket.io')(app);
var fs  = require('fs');
io.on('connection', function (socket) {
    var out_d = ''
    var out_a = ''
    var out_e = ''
    var out_k = ''
    // send gps every 1000ms from influxDB
    setInterval(function (){

	// demian
	var query = "select * from car_data_d " + 
	    "where time < now()-2s order by desc limit 2"
	console.log(query);
	influx.query(query).then(
	    result => {
		out_d = GeoJSON.parse(result[0],
				    {Point: ['latitude', 'longitude']});
	    }).catch(err => {
		console.log('error');
		res.status(500).send(err.stack)
	    });
	socket.emit('geo_data_d', out_d);
	console.log("emit_d > ", out_d);

	// angela
	var query = "select * from car_data_a " + 
	    "where time < now()-2s order by desc limit 2"
	console.log(query);
	influx.query(query).then(
	    result => {
		out_a = GeoJSON.parse(result[0],
				    {Point: ['latitude', 'longitude']});
	    }).catch(err => {
		console.log('error');
		res.status(500).send(err.stack)
	    });
	socket.emit('geo_data_a', out_a);
	console.log("emit_a > ", out_a);
	
	// einsteinfiles
	var query = "select * from car_data_e " + 
	    "where time < now()-2s order by desc limit 2"
	console.log(query);
	influx.query(query).then(
	    result => {
		out_e = GeoJSON.parse(result[0],
				    {Point: ['latitude', 'longitude']});
	    }).catch(err => {
		console.log('error');
		res.status(500).send(err.stack)
	    });
	socket.emit('geo_data_e', out_e);
	console.log("emit_e > ", out_e);
	
	// karl
	var query = "select * from car_data_k " + 
	    "where time < now()-2s order by desc limit 2"
	console.log(query);
	influx.query(query).then(
	    result => {
		out_k = GeoJSON.parse(result[0],
				    {Point: ['latitude', 'longitude']});
	    }).catch(err => {
		console.log('error');
		res.status(500).send(err.stack)
	    });
	socket.emit('geo_data_k', out_k);
	console.log("emit_k > ", out_k);
	
    }, 1000);    
});

console.log("time_now on this VM : " + moment().format());



















////
//// Python Shell Test
////
//var PythonShell = require('python-shell');
// 
//var options = {
//  mode: 'text',
//  pythonPath: '/home/ubuntu/anaconda2/envs/py2/bin/python',
//  pythonOptions: ['-u'],
//  scriptPath: '/home/ubuntu/Project/2016.07_TimeSeries/Clustering/',
////  args: ['value1', 'value2', 'value3']
//};
//
//PythonShell.run('convertData.py', options, function (err, results) {
//    if (err) throw err;
//    // results is an array consisting of messages collected during execution 
//    console.log('finished.');
//    console.log('results: %j', results);
//});

////
//// Python Shell Test
////
//var PythonShell = require('python-shell');
// 
//var options = {
//  mode: 'text',
//  pythonPath: '/home/ubuntu/anaconda2/envs/py2/bin/python',
//  pythonOptions: ['-u'],
//  scriptPath: '/home/ubuntu/Project/2016.07_TimeSeries/Clustering/',
////  args: ['value1', 'value2', 'value3']
//};
//
//PythonShell.run('convertData.py', options, function (err, results) {
//    if (err) throw err;
//    // results is an array consisting of messages collected during execution 
//    console.log('finished.');
//    console.log('results: %j', results);
//});
