//Establishing required modules
const mysql = require('./public/database/database_con.js');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');

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

// Routing
app.get('/', function(req, res) {
    // Gathering income amounts from DB
    let query = 'SELECT * FROM `Income`';
    let income;
    sql = mysql.pool.query(query, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            income = results;
            console.log(results);
            mysql.pool.end();
        }
    });
    console.log(income);

    /*
    // Gathering income labels from DB
    query = 'SELECT `label` FROM `Income`'
    let incomeLabs;
    sql = mysql.pool.query(query, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            incomeLabs = results;
        }
    })
    console.log(incomeLabs[0]);

     */

    const body = {
        column: [
            { type: "string", title: "total income" },
            { type: "number", title: "Slices" },
        ],
        row: [
            { name: "${incomeLabs[0]}", value: "5" },
            { name: "Onions", value: "1" },
            { name: "Olives", value: "2" },
            { name: "Zucchini", value: "1"},
            { name: 'Bibimbap', value: '200'}
        ],
        option: { title: 'I sure hope this works!', width: '400', height: '350'}
    };

    fetch('http://flip2.engr.oregonstate.edu:3003/', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
    })
        .then(res => {
            const dest = fs.createWriteStream('./public/img/chart.png');
            res.body.pipe(dest);
        })
        .catch(err => console.error(err));

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
