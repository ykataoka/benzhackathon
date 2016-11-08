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
option = {
//    host : 'localhost',
    port : 8086,       
    protocol : 'http', 
    username : 'root',
    password : 'root',
    database : 'benz_realtime'
}
console.log(option);
//const Influx = require('influx');
//const client = new Influx.InfluxDB(option)
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'express_response_db',
  schema: [
    {
      measurement: 'response_times',
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

console.log(client);

var query = 'SELECT * FROM benz_realtime limit 2';
console.log(query);
var data_cycle = '';
client.query(query, function(err, results) {
    console.log('hoge');
//    data_cycle = results[0]; // potential bug : if results is not here...
    if(err){
	console.log("something went bad...");
    }
//    // send to client by geojson
//    var out = GeoJSON.parse(data_cycle, {Point: ['latitude', 'longitude']});
//    socket.emit('geo_data', out);
//    console.log("emitting > ", out);
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

//    // get the label data by user
//    socket.on('label', function (data) {
//	console.log("web socket : received data from grafana(10.34.12.12)!");
//	console.log(data);
//	
//	// convert time to epoch time
//	//  Note : This VM has UTC time as default time, whereas the time is pacific time.
//	//  Note : moment JS considers the str as local time.
//	//  Note : After trial and error, the easiest way is to add "TimeDifference" at the end of the string...
//	var str = data['label'];
//	var index = str.indexOf('\n'); // parse the time string data
//	var time_str = str.slice(0, index) + "-07"; // add the time difference
//	console.log("recieved time : " + time_str);
//	var time_epoch = moment(time_str).valueOf(); //this simply
//	console.log('insert time : ' + moment(time_str).format() + "(" + time_epoch + ")");
//	
//	//store data to influxDB
//	console.log(time_epoch);
//	client.writePoint("doug_data",                                         // measurement name
//			  { time : time_epoch, user_annotation : 1 }, // add timestamp
//			  null, null, 
//			  function(err, response){
//			      if(err){
//				  console.log('Error > ' + err);
//			      }else{
//				  console.log("send success! (doug_data)");
//			      }
//			  });
//
//	//select data from influxDB (5mins for now)
//	var options = {
//	    mode: 'text',
//	    pythonPath: '/home/ubuntu/anaconda2/envs/py2/bin/python',
//	    pythonOptions: ['-u'],
//	    scriptPath: '/home/ubuntu/Project/2016.07_TimeSeries/Clustering/',
//	    args: [time_epoch]
//	};
//	console.log("similarity computation... ");
//	PythonShell.run('convertDataReal.py', options, function (err, results) {
//	    if (err) throw err;
//
//	    // results is an array consisting of messages collected during execution
//	    console.log('results: %j', results);
//	    var time_list = results[0];
//	    var hoge = time_list.split(' ');
//	    var re = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/i;
//	    for(i=0; i<hoge.length; i++){
//		var sim_time = hoge[i].match(re)[0];
//		console.log("writing > " + sim_time);
//		var time_epoch = moment(sim_time).valueOf()
//		client.writePoint("doug_data",                               // measurement name
//				  { time : time_epoch, sim_annotation : 1 }, // add timestamp
//				  null, null, 
//				  function(err, response){
//				      if(err){
//					  console.log('Error > ' + err);
//				      }else{
//					  console.log("send success! (doug_data)");
//				      }
//				  });
//	    }
//	});
//    });

    // send gps every 1000ms
    setInterval(function (){
	//var query = 'SELECT * FROM benz_realtime WHERE time > now() - 2s limit 1';
	var query = 'SELECT * FROM benz_realtime limit 2';
	console.log(query);
	var data_cycle = '';
	client.query(query, function(err, results) {
	    console.log('hoge');
	    data_cycle = results[0]; // potential bug : if results is not here...
	    if(err){
		console.log("something went bad...");
	    }
	    // send to client by geojson
	    var out = GeoJSON.parse(data_cycle, {Point: ['latitude', 'longitude']});
	    socket.emit('geo_data', out);
	    console.log("emitting > ", out);
	});
	var datetime = new Date();
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
