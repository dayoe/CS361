//Establishing required modules
const mysql = require('./public/database/database_con.js');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');

//Creating module settings
app.use(express.static('public'));
app.engine('.hbs', handlebars({
    extname: ".hbs"
}));
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('port', 3031);
app.set('view engine', '.hbs')

//Routing
app.get('/', function(req, res){
	res.render('index');
});

app.get('/:id', function(req, res){
	res.sendFile(path.join(__dirname + '/' + req.params.id + '.html'));
});


//Error handling
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

//Creating server
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
