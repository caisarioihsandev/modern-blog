const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: './.env' })

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// MYSQL connection
db.connect((err) => {
    if (err) {
        console.error("Error opening database: ", err.message);
    } else {
        console.log('SQLite Connected...');
    }
});

module.exports = db;
