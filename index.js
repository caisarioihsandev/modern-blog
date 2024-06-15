const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const { error } = require("console");

let initial_path = path.join(__dirname, "/public");
const app = express();

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "",
    database:"m_blog"
});
  
// MYSQL connection
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(initial_path));
app.use(fileupload());

// Serve the HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path,"home.html"));
});

app.get('/api/blogs', (req, res) => {
    const query = 'SELECT * FROM blogs';

    db.query(query, [], (error, results) => {
        if (error) {
            res.status(500).send('Server error');
            throw error;
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No Blog to be written');
        }
    });
});

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

// upload link
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // image upload path
    let path = 'public/uploads/' + imagename;

    // create upload
    file.mv(path, (err, result) => {
        if (err) {
            throw err;
        } else {
            // image upload path
            res.json(`uploads/${imagename}`);
        }
    })
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { title, article, bannerImage, publishedAt, docName } = req.body;
    const sql = 'INSERT INTO blogs (title, article, bannerImage, publishedAt, docName) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, article, bannerImage, publishedAt, docName], (err, result) => {
        if (err) {
            console.error(err);
            res.json({ success: false, error: err.message });
            return;
        }
        console.log('Data inserted');
        res.json({ success: true });
    });
});

app.get('/:id', (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});

// Define a route to get a blog post by ID
app.get('/api/blog/:id', (req, res) => {
    const blogId = req.params.id;

    const query = 'SELECT * FROM blogs WHERE id = ?';
    db.query(query, [blogId], (error, results) => {
        if (error) {
            res.status(500).send('Server error');
            throw error;
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Blog not found');
        }
    });
});

app.use((req, res) => {
    res.json("404");
});

app.listen(3000, () => {
    console.log("....serving!!");
});