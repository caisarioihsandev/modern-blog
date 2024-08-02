const db = require("../config/db");
const jwt = require("jsonwebtoken");

// for deleting image
const fs = require('fs');

const secretKey = 'hello_world';

const blogs = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(403).json({ msg: 'No token, authorization denied' });

    try {
        const decode = jwt.verify(token, secretKey);
        const query = 'SELECT * FROM blogs WHERE author = ?';
        db.query(query, [decode.id], (error, results) => {
            if (error) {
                res.status(500).send('Server error');
            }
    
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).send('No Blog to be written');
            }
        });
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

const allblogs = (req, res) => {
    const query = 'SELECT * FROM blogs';
    db.query(query, (error, results) => {
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
};



const singleblog = (req, res) => {
    const blogDocName = req.params.id;
    
    // Please add inner join to users table
    const query = 'SELECT * FROM blogs WHERE docName = ?';
    db.query(query, [blogDocName], (error, results) => {
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
};

// Handle submission
const submit = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(403).json({ msg: 'No token, authorization denied' });

    // console.log(req.body);

    try {
        const decode = jwt.verify(token, secretKey);
        req.user = decode;
        const author = req.user.id;
        const data = req.body;
        let sql;
        if (Number(data.id)) {
            // UPDATE the existing article
            sql = `UPDATE blogs SET 
                title = ?, 
                article = ?, 
                bannerImage = ?, 
                publishedAt = ?, 
                docName = ?, 
                author = ?
            WHERE id=?`;
            
            db.query(sql, [
                data.title, 
                data.article, 
                data.bannerImage, 
                data.publishedAt, 
                data.docName, 
                author,
                Number(data.id)
            ], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.json({ success: false, error: err.message });
                }
                console.log('Data updated');
                res.json({ success: true });
            });
            
        } else {
            // INSERT new article
            sql = 'INSERT INTO blogs (title, article, bannerImage, publishedAt, docName, author) VALUES (?, ?, ?, ?, ?, ?)';
            
            db.query(sql, [
                data.title, 
                data.article, 
                data.bannerImage, 
                data.publishedAt, 
                data.docName, 
                author
            ], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.json({ success: false, error: err.message });
                }
                console.log('Data inserted');
                res.json({ success: true });
            });
        }
    } catch (error) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

const remove = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(403).json({ msg: 'No token, authorization denied' });

    const docName = req.params.id;
    let sql; 
    let filePath;
    
    sql = 'SELECT * FROM blogs WHERE docName = ?';
    db.query(sql, [docName], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, error: err.message });
        }
        // Delete banner-image from folder
        let seperator;

        const bnrImg = result[0].bannerImage || '';
        if (bnrImg) {
            for (let i = 0; i < bnrImg.length; i++) {        
                if (bnrImg[i] === '0' && bnrImg[i + 1] === '/') {
                    seperator = i;
                }
            }            
            filePath = 'public/' + bnrImg.slice(seperator + 2, bnrImg.length);
    
            // Remove the file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
                console.log(`File ${filePath} has been successfully removed.`);
            });
        }
        
        const article = result[0].article.split("\n").filter(item => item.length);
        
        // Delete image if there is any image in article
        article.forEach(item => {
            // checking image format
            if (item[0] === "!" && item[1] === "[") {
                for(let i = 0; i <= item.length; i++){
                    if(item[i] === "]" && item[i + 1] === "(" && item[item.length - 1] === ")"){
                        seperator = i;
                    }
                }

                let alt = item.slice(2, seperator);
                let src = 'public/' + item.slice(seperator + 2, item.length - 1);

                fs.unlink(src, (err) => {
                    if (err) {
                        console.error(`Error removing file: ${err}`);
                        return;
                    }
                    console.log(`File ${src} has been successfully removed.`);
                });
            }
        })

        // Delete from database
        sql = 'DELETE FROM blogs WHERE docName = ?';
        db.query(sql, [docName], (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, error: err.message });
            }}
        );
        res.json({ success: true });
    });
}

module.exports = {
    blogs: blogs,
    allblogs: allblogs,
    singleblog: singleblog,
    submit: submit,
    remove: remove    
}