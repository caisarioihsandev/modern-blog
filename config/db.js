const sqlite3 = require("sqlite3");
const path = require('path');
const dbFile = path.join(__dirname, 'm_blog.db');

const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database: ", err.message);
    } else {
        console.log('SQLite Connected...');
    }
});

module.exports = db;
