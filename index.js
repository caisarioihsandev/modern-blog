const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const db = require("./config/db.js");
const apiUserRoutes = require("./routes/apiUser.js");
const apiBlogRoutes = require("./routes/apiPost.js");

const verifyToken = require("./controllers/user.js").verifyToken;

const initial_path = path.join(__dirname, "/public");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(initial_path));
app.use(fileupload());

// API routes
app.use("/apiuser", apiUserRoutes.router);
app.use("/apiblog", apiBlogRoutes.router);

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

// Serve the HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path,"home.html"));
});

app.get('/admin', verifyToken, (req, res) => {
    res.sendFile(path.join(initial_path, "dashboard.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(initial_path, "login.html"));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(initial_path, "register.html"));
});

// Create New Blog
app.get('/editor', verifyToken, (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

app.get('/:docName', (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});

// Update/Edit Blog
app.get('/:docName/editor', verifyToken, (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

app.use((req, res) => {
    res.json("404");
});

app.listen(80, () => {
    console.log("....serving!!");
});

