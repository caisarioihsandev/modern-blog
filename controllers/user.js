const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secretKey = 'hello_world';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {    
    const token = req.cookies.access_token;
    if (!token) {
        res.redirect('/login');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.user = decoded;
        next();
    });
}

// Registration (input new user)
const register = (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ msg: 'Internal server error'});
        }

        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hash],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ msg: 'Internal server error' });
                }

                res.json({ msg: 'User registered' });
            }
        );
    });
};

// Login system
const login = (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Internal server error' });
        }

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ msg: 'Internal server error' });
                }
                if (isMatch) {
                    const token = jwt.sign(
                        {id: result[0].id},
                        secretKey,
                        {expiresIn: '1h'}
                    );

                    const { password, ...other } = result[0];
                    res
                    .status(200)
                    .json({ user: other , token })
                } else {
                    res.status(400).json({ msg: 'Invalid credentials' });
                }
            });
        } else {
            res.status(400).json({ msg: 'User not found' });
        }
    });
};

module.exports = {
    verifyToken: verifyToken,
    register: register,
    login: login
}