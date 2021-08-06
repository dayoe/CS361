var mysql = require('./database/database_con.js')
var express = require('express');
const path = require('path');

var app = express();
app.use(express.static('public'))

app.set('port', 3031);

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/:id', function(req, res){
	res.sendFile(path.join(__dirname + '/' + req.params.id + '.html'));
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
