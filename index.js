//Establishing required modules
const mysql = require('./public/database/database_con.js');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');


// Setting up middleware
app.use(express.static('public'));
app.engine('.hbs', handlebars({
    extname: ".hbs"
}));
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Settings
app.set('port', 3031);
app.set('view engine', '.hbs')
app.set('mysql', mysql)

// Custom middleware
var getIncomeData = function(req, res, next) {
    query = 'SELECT `label`, `amount` FROM `Income`';
    mysql.pool.query(query, function (error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            req.body.incomeData = results;
            //console.log('req.body: ' + JSON.stringify(req.body));
            next();
        }
    })
}

var getExpenseData = function(req, res, next) {
    query = 'SELECT * FROM `Expense`';
    mysql.pool.query(query, function (error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            req.body.expenseData = results;
            next();
        }
    })
}
var getGoalData = function(req, res, next) {
    query = 'SELECT * FROM `Goal`';
    mysql.pool.query(query, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            req.body.goals = [];
            for (let i in results) {
                req.body.goals[i] = {
                    label: results[i].label,
                    amount: results[i].amount,
                    saved: results[i].saved
                }
            }
            console.log('req.body.goals: ' + JSON.stringify(req.body.goals));
            //console.log('results: ' + JSON.stringify(results));
            next();
        }
    })
}

var makeAltBody = function(req, res, next) {
    let total = 0;
    for (let i in req.body.incomeData) {
        total += req.body.incomeData[i]['amount']
    }

    let expenses = 0;
    for (let j in req.body.expenseData) {
        expenses += req.body.expenseData[j]['amount']
    }

    let remainingIncome = total - expenses;
    let newRow = [];
    for (let k in req.body.expenseData) {
        newRow.push({ name: `${req.body.expenseData[k]['label']}`, value: `${req.body.expenseData[k]['amount']}` });
    }
    newRow.push({name: 'Remaining Income', value: `${remainingIncome}`});
    const body = {
        column: [
            { type: "string", title: "Expense Breakdown" },
            { type: "number", title: "Dollars" },
        ],
        row: newRow,
        option: { title: 'Expense Breakdown', width: '700', height: '700'}
    };
    req.body.bodyData = body;
    req.body.chartType = 'expenses';
    next();
}

var makeBody = function(req, res, next) {
    let newRow = [];
    let iterateRow = () => {
        for (let i in req.body.incomeData) {
            newRow.push({ name: `${req.body.incomeData[i]['label']}`, value: `${req.body.incomeData[i]['amount']}` });
        }
        //console.log('newRow: ' + JSON.stringify(newRow));
        return newRow;
    }
    iterateRow();
    const body = {
        column: [
            { type: "string", title: "total income" },
            { type: "number", title: "Dollars" },
        ],
        row: newRow,
        option: { title: 'Total Income', width: '700', height: '700'}
    };
    req.body.bodyData = body;
    req.body.chartType = 'incomes';
    next();
}

var makeChart = function(req, res, next) {
    console.log(JSON.stringify(req.body.bodyData));
    fetch('http://flip2.engr.oregonstate.edu:3003/', {
        method: 'post',
        body: JSON.stringify(req.body.bodyData),
        headers: {'Content-Type': 'application/json'},
    })
        .then(res => {
            const dest = fs.createWriteStream(`./public/img/${req.body.chartType}.png`);
            res.body.pipe(dest);
            next();
        })
}

var makeBar = function(req, res, next) {
    fetch('http://flip2.engr.oregonstate.edu:3003/bar', {
        method: 'post',
        body: JSON.stringify(req.body.goals),
        headers: { 'Content-Type': 'application/json'},
    })
        .then(res => {
            const dest = fs.createWriteStream('./public/img/bar.png');
            res.body.pipe(dest);
            next();
        })
}

// Routing
var chart = [getIncomeData, getExpenseData, makeBody, makeChart, makeAltBody, makeChart, getGoalData]; //, makeBar
var test = [getIncomeData,] ;
app.get('/', chart, function(req, res) { // chart,
    res.render('index', req.body.goals);
});

app.post('/income', function (req, res) {
  let query = "INSERT INTO `Income` (`label`, `amount`) VALUES (?, ?)";
  let inserts = [req.body.incomeLabel, req.body.incomeAmount];
  sql = mysql.pool.query(query, inserts, function(error, results, fields) {
      if(error) {
          res.write(JSON.stringify(error));
          res.end();
      } else {
          res.redirect('/');
      }
  })
})

app.post('/expense', function (req, res) {
    let query = "INSERT INTO `Expense` (`label`, `amount`) VALUES (?, ?)";
    let inserts = [req.body.expenseLabel, req.body.expenseAmount];
    sql = mysql.pool.query(query, inserts, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.render('index');
        }
    })
})

app.post('/goal', function (req, res) {
    let query = "INSERT INTO `Goal` (`label`, `amount`) VALUES (?, ?)";
    let inserts = [req.body.goalLabel, req.body.goalAmount];
    sql = mysql.pool.query(query, inserts, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/');
        }
    })
})

app.get('/income/success', function (req, res) {
    res.render('sucIncome');
})

app.get('/expense/success', function (req, res) {
    res.render('sucExpense');
})

app.get('/goal/success', function (req, res) {
    res.render('sucGoal');
})

 app.get('/income/undo', function (req, res) {
     let query = "DELETE FROM `Income` WHERE `id` in(SELECT MAX(id) FROM `Income`)";
     sql = mysql.pool.query(query, function (error, results, fields) {
         if(error) {
             console.log(error);
         } else {
             res.send('Successfully undone! You may close this window.');
         }
     })
 })

app.get('/expense/undo', function (req, res) {
    let query = "DELETE FROM `Expense` WHERE `id` in(SELECT MAX(id) FROM `Expense`)";
    sql = mysql.pool.query(query, function (error, results, fields) {
        if(error) {
            console.log(error);
        } else {
            res.send('Successfully undone! You may close this window.');
        }
    })
})

app.get('/goal/undo', function (req, res) {
    let query = "DELETE FROM `Goal` WHERE `id` in(SELECT MAX(id) FROM `Goal`)";
    sql = mysql.pool.query(query, function (error, results, fields) {
        if(error) {
            console.log(error);
        } else {
            res.send('Successfully undone! You may close this window.');
        }
    })
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
