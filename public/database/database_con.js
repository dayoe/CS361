var mysql = require('mysql');

var pool = mysql.createPool({
	host	:'classmysql.engr.oregonstate.edu',
	user	:'cs361_parkd3',
	password:'7988',
	database:'cs361_parkd3'
});

module.exports.pool = pool;