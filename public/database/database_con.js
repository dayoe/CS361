const mysql = require('mysql');

const pool = mysql.createPool({
	host	:'classmysql.engr.oregonstate.edu',
	user	:'cs361_parkd3',
	password:'ReUzaa9CsVegJmXb',
	database:'cs361_parkd3'
});

module.exports.pool = pool;