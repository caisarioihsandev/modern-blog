const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: './.env' })

const db = mysql.createConnection({
    host: "153.92.8.43",
    port: 995,
    user: "u2934543_viyori",
    password: "admin1234",
    database: "u2934543_blogging"
});

// MYSQL connection
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

module.exports = db;
