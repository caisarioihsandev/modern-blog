const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: './.env' })

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USERNAME || "u2934543_viyori",
    password: process.env.DATABASE_PASSWORD || "admin1234",
    database: process.env.DATABASE || "u2934543_blogging"
});

// MYSQL connection
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

module.exports = db;
