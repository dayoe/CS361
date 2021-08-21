//Establishing required modules
const mysql = require('./public/database/database_con.js');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');
//const popup = require('popups'); TESTING BROWSERIFY


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
    /*
    // Gathering income amounts from DB
    async function getIncomes() {
        let query = 'SELECT `label`, `amount` FROM `Income`';
        let income = [];
        return new Promise((resolve, reject) => {
            mysql.pool.query(query, function(error, results) {
            if (error) {
                reje
            }
        })

            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                setIncomes(results);
                //console.log(results);
            }
        });
    }
    getIncomes();
    //console.log(income);

     */

    function setIncomes(results) {
        let incomes = results;
        return incomes;
    }

    // Gathering income labels from DB
     function getIncomeData () {
        query = 'SELECT `label`, `amount` FROM `Income`';
        sql = mysql.pool.query(query, async function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                await makeChart(setIncomes(results));
            }
        })
    }
    getIncomeData();

    // Getting Goal information
    function getGoalData () {
        query = 'SELECT * FROM `Goal`';
        sql = mysql.pool.query(query, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                let goalData = {
                    label: [],
                    amount: [],
                    saved: []
                };
                for (let i in results) {
                    goalData.label.push(results[i].label);
                    goalData.amount.push(results[i].amount);
                    goalData.saved.push(results[i].saved);
                }
                console.log(goalData);
                console.log(results);
                return goalData;
            }
        } )
    }

    function makeChart (incomes) {
        let newRow = [];
        let iterateRow = () => {
            for (let i in incomes) {
                newRow.push({ name: `${incomes[i]['label']}`, value: `${incomes[i]['amount']}` });
            }
            console.log(newRow);
            return newRow;
        }
        iterateRow();
        const body = {
            column: [
                { type: "string", title: "total income" },
                { type: "number", title: "Dollars" },
            ],
            row: newRow,
            option: { title: 'Total Income', width: '300', height: '400'}
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
            .then( () => { getGoalData();})
            .then( (goalData) => { console.log('goalData'); res.render('index', goalData);})
            .catch(err => console.error(err));
    }
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
            res.render('index');
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
