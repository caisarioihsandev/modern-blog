const express = require("express");
const router = express.Router();

const { blogs, allblogs, singleblog, submit, remove } = require("../controllers/post");
const { verifyToken } = require("../controllers/user");

router.get("/blogs", verifyToken, blogs);
router.get("/allblogs", allblogs);
router.get("/blog/:id", singleblog);
router.post("/submit", verifyToken, submit);
router.get("/remove/:id", remove);

module.exports = {
    router: router
};