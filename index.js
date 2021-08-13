//Establishing required modules
const mysql = require('./public/database/database_con.js');
const agent = require('https-agent');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const https = require('https');

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
app.set('mysql', mysql)

// Getting graph
const data = JSON.stringify({
  "column":[{"type":"string","title":"Toppings"}, {"type":"number","title":"Slices"}],
  "row":[{"name":"Mushrooms","value":"3"},{"name":"Onions","value":"1"},{"name":"Olives","value":"2"}]
})

const options = {
  hostname: 'flip2.engr.oregonstate.edu',
  port: 3003,
  path: '/',
  agent: new agent({ rejectUnauthorized: false }),
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request(options, res => {
  console.log('status code: ' + res.statusCode);

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data);
req.end();

// Routing
app.get('/', function(req, res) {
	res.render('index');
});


app.post('/income', function (req, res) {
  let query = "INSERT INTO `Income` (`label`, `amount`) VALUES (?, ?)";
  let inserts = [req.body.incomeLabel, req.body.incomeAmount];
  sql = mysql.pool.query(query, inserts, function(error, results, fields) {
    if(error) {
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.render('index');
    }
  })
})

 app.get('/income/undo', function (req, res) {
  res.render('undoIncome');
})

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
